import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useCategories } from "../hooks/useCategories";
import ArticlesTable from "../components/knowledge/articles/ArticlesTable";
import CategoriesTable from "../components/knowledge/categories/CategoriesTable";
import UpdateLogTable from "../components/knowledge/revisions/UpdateLogTable";
import ArticleEditorDrawer from "../components/knowledge/articles/ArticleEditorDrawer";
import CategoryEditorDrawer from "../components/knowledge/categories/CategoryEditorDrawer";
import CategoryEditorModal from "../components/knowledge/categories/CategoryEditorModal";
import ArticleEditorModal from "../components/knowledge/articles/ArticleEditorModal";
import { useArticles } from "../hooks/useArticles";
import {
  MdAdd,
  MdArticle,
  MdCategory,
  MdHistory,
  MdLibraryBooks,
} from "react-icons/md";

export default function KnowledgeBaseManagement() {
  const { colors } = useTheme();
  const {
    rows: categories,
    loading: categoriesLoading,
    save: saveCategory,
  } = useCategories();

  const TABS = [
    { key: "articles", label: "Articles", icon: MdArticle },
    { key: "categories", label: "Categories", icon: MdCategory },
    { key: "revisions", label: "Update Log", icon: MdHistory },
  ];

  const [activeTab, setActiveTab] = useState("articles");
  const [articleEditorOpen, setArticleEditorOpen] = useState(false);
  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const {
    rows: pageRows,
    loading: pageLoading,
    save: saveArticle,
  } = useArticles();

  const handleSaveCategory = async (category) => {
    // persist via the categories hook so the table refreshes
    try {
      await saveCategory(category);
    } catch (err) {
      console.error("Failed saving category", err);
    }
    setCategoryEditorOpen(false);
    setEditingItem(null);
  };

  const getAddButtonConfig = () => {
    switch (activeTab) {
      case "articles":
        return {
          onClick: () => {
            setEditingItem(null);
            setArticleEditorOpen(true);
          },
          text: "New Article",
          icon: MdArticle,
        };
      case "categories":
        return {
          onClick: () => {
            setEditingItem(null);
            setCategoryEditorOpen(true);
          },
          text: "New Category",
          icon: MdCategory,
        };
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "articles":
        return (
          <ArticlesTable
            onEdit={(article) => {
              setEditingItem(article);
              setArticleEditorOpen(true);
            }}
          />
        );
      case "categories":
        return (
          <CategoriesTable
            rows={categories}
            loading={categoriesLoading}
            onEdit={(category) => {
              setEditingItem(category);
              setCategoryEditorOpen(true);
            }}
          />
        );
      case "revisions":
        return <UpdateLogTable />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: colors.accent + "20" }}
          >
            <MdLibraryBooks size={24} style={{ color: colors.accent }} />
          </div>
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ color: colors.text }}
            >
              Knowledge Base Management
            </h1>
            <div className="text-sm mt-1" style={{ color: colors.text2 }}>
              Comprehensive knowledge management system
            </div>
          </div>
        </div>

        {(() => {
          const addButtonConfig = getAddButtonConfig();
          return addButtonConfig ? (
            <button
              onClick={addButtonConfig.onClick}
              aria-label={addButtonConfig.text}
              title={addButtonConfig.text}
              className="flex items-center gap-2 px-2 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: colors.accent,
                color: "#000",
                // keep a sensible min width on larger screens
                minWidth: 48,
              }}
            >
              <addButtonConfig.icon size={18} />
              <span className="hidden sm:inline">{addButtonConfig.text}</span>
            </button>
          ) : null;
        })()}
      </div>

      {/* Tab Navigation */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${colors.ring}` }}
      >
        <div style={{ backgroundColor: colors.accent + "10" }}>
          <div className="flex items-center gap-6 px-4 py-3">
            {TABS.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-2 uppercase text-xs font-semibold"
                  style={{
                    color: colors.accent,
                    padding: "6px 10px",
                    borderRadius: 8,
                    background:
                      activeTab === tab.key
                        ? colors.accent + "15"
                        : "transparent",
                    boxShadow:
                      activeTab === tab.key
                        ? `inset 0 -2px 0 ${colors.accent}`
                        : "none",
                  }}
                >
                  <IconComponent size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ backgroundColor: colors.bg2 }}>
        {activeTab === "articles" ? (
          <ArticlesTable
            onEdit={(article) => {
              setEditingItem(article);
              setArticleEditorOpen(true);
            }}
            data={pageRows}
            loading={pageLoading}
          />
        ) : (
          renderContent()
        )}
      </div>

      {/* Drawers */}
      {/* Modal-based editor for articles (works on top of page-level hook) */}
      <ArticleEditorModal
        isOpen={articleEditorOpen}
        article={editingItem}
        onClose={() => {
          setArticleEditorOpen(false);
          setEditingItem(null);
        }}
        onSave={async (a) => {
          await saveArticle(a);
          setArticleEditorOpen(false);
          setEditingItem(null);
        }}
        categories={categories}
      />

      {/* keep the drawer for backward compatibility but prefer the modal */}
      <CategoryEditorModal
        isOpen={categoryEditorOpen}
        initial={editingItem}
        onClose={() => {
          setCategoryEditorOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
