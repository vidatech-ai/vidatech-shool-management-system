import { prisma } from "@/lib/prisma";
import { guardDashboard } from "@/core/auth/page-guard";
import AddUserForm from "./add-user-form";
import UserStatusButton from "./user-status-button";

const cell = { padding: "8px 10px", borderBottom: "1px solid #e2e8f0", textAlign: "left", fontSize: 14 } as const;

export default async function Page() {
  const session = await guardDashboard(["ADMIN"]);
  const users = await prisma.user.findMany({
    where: { schoolId: session.schoolId! },
    select: {
      id: true,
      role: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      admissionNumber: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>Users</h1>
      <p style={{ color: "#475569", margin: "0 0 20px", fontSize: 14 }}>
        {users.length} user{users.length === 1 ? "" : "s"} in your school.
      </p>

      <section style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>Add a user</h2>
        <AddUserForm />
      </section>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Name", "Role", "Contact", "Status", "Created", "Action"].map((h) => (
                <th key={h} style={{ ...cell, fontWeight: 600, background: "#f8fafc" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={cell}>{u.firstName} {u.lastName}</td>
                <td style={cell}>{u.role.replace("_", " ")}</td>
                <td style={cell}>{u.email || u.phone || u.admissionNumber || "-"}</td>
                <td style={{ ...cell, color: u.isActive ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                  {u.isActive ? "Active" : "Inactive"}
                </td>
                <td style={cell}>{u.createdAt.toISOString().slice(0, 10)}</td>
                <td style={cell}>
                  {u.role === "ADMIN" || u.id === session.userId ? "-" : <UserStatusButton userId={u.id} isActive={u.isActive} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
