export const USERS_FIXTURES = Array.from({ length: 57 }).map((_, i) => {
  const roles = ["driver", "instructor", "admin", "staff"];
  const role = roles[i % roles.length];
  return {
    id: `u_${i + 1}`,
    fullName: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role,
    status: i % 7 === 0 ? "suspended" : "active",
    lastLoginAt: Date.now() - i * 86400000,
    lastLoginIp: `192.168.1.${(i % 50) + 1}`,
    device: i % 3 === 0 ? "iOS" : i % 3 === 1 ? "Android" : "Web",
    purchasedCourses: Math.floor(Math.random() * 6),
    chassisUses: Math.floor(Math.random() * 20),
  };
});

export const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@motorsport.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15",
    fullName: "John Doe",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@motorsport.com",
    role: "instructor",
    status: "active",
    createdAt: "2024-02-01",
    fullName: "Jane Smith",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@motorsport.com",
    role: "driver",
    status: "suspended",
    createdAt: "2024-02-10",
    fullName: "Mike Johnson",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@motorsport.com",
    role: "staff",
    status: "active",
    createdAt: "2024-02-15",
    fullName: "Sarah Wilson",
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex@motorsport.com",
    role: "driver",
    status: "active",
    createdAt: "2024-02-20",
    fullName: "Alex Brown",
  },
];
