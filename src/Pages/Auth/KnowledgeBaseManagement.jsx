import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import SectionCard from "../../components/ui/common/SectionCard";
import Pagination from "../../components/ui/common/Pagination";
import ArticleFiltersBar from "../../components/knowledge/articles/ArticleFiltersBar";
import ArticlesTable from "../../components/knowledge/articles/ArticlesTable";
import ArticleEditorDrawer from "../../components/knowledge/articles/ArticleEditorDrawer";
import CategoriesTable from "../../components/knowledge/categories/CategoriesTable";
import CategoryEditorDrawer from "../../components/knowledge/categories/CategoryEditorDrawer";
import UpdateLogTable from "../../components/knowledge/revisions/UpdateLogTable";
import { useArticles } from "../../hooks/useArticles";
import { useCategories } from "../../hooks/useCategories";
import { useRevisions } from "../../hooks/useRevisions";

export default function KnowledgeBaseManagement() {
  const { colors } = useTheme();

  // Categories
  const categories = useCategories();
  const [openCat, setOpenCat] = useState(false);
  const [editCat, setEditCat] = useState(null);

  // Articles
  const articles = useArticles();
  const [openArt, setOpenArt] = useState(false);
  const [editArt, setEditArt] = useState(null);

  // Revisions (recent 20 across all)
  const revisions = useRevisions();

  return (
    <div className="space-y-6">
      {/* Articles Library */}
      <SectionCard
        title="Articles Library"
        subtitle="Setup principles, FAQs, best practices"
        right={
          <button
            className="px-3 py-2 rounded-xl border"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text2,
            }}
            onClick={() => {
              setEditArt(null);
              setOpenArt(true);
            }}
          >
            Add Article
          </button>
        }
      >
        <div className="mb-4">
          <ArticleFiltersBar
            query={articles.state.query}
            onQuery={articles.search}
            categoryId={articles.state.categoryId}
            onCategory={articles.setCategory}
            status={articles.state.status}
            onStatus={articles.setStatus}
            tag={articles.state.tag}
            onTag={articles.setTag}
            categories={categories.rows}
          />
        </div>
        <ArticlesTable
          rows={articles.rows}
          loading={articles.loading}
          onEdit={(a) => {
            setEditArt(a);
            setOpenArt(true);
          }}
        />
        <Pagination
          page={articles.state.page}
          pageSize={articles.state.pageSize}
          total={articles.total}
          onPageChange={articles.setPage}
        />
      </SectionCard>

      {/* Categories */}
      <SectionCard
        title="Categories"
        subtitle="Suspension, tyres, geometry, alignment"
        right={
          <button
            className="px-3 py-2 rounded-xl border"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text2,
            }}
            onClick={() => {
              setEditCat(null);
              setOpenCat(true);
            }}
          >
            Add Category
          </button>
        }
      >
        <CategoriesTable
          rows={categories.rows}
          loading={categories.loading}
          onEdit={(c) => {
            setEditCat(c);
            setOpenCat(true);
          }}
        />
      </SectionCard>

      {/* Update Log */}
      <SectionCard
        title="Update Log"
        subtitle="Versioning of published articles (latest)"
      >
        <UpdateLogTable
          rows={revisions.rows.slice(0, 20)}
          loading={revisions.loading}
        />
      </SectionCard>

      {/* Drawers */}
      <ArticleEditorDrawer
        open={openArt}
        onClose={() => setOpenArt(false)}
        article={editArt}
        categories={categories.rows}
        onSave={async (f, meta) => {
          await articles.save({ ...editArt, ...f }, meta);
          setOpenArt(false);
        }}
      />
      <CategoryEditorDrawer
        open={openCat}
        onClose={() => setOpenCat(false)}
        category={editCat}
        onSave={async (f) => {
          await categories.save({ ...editCat, ...f });
          setOpenCat(false);
        }}
      />
    </div>
  );
}
