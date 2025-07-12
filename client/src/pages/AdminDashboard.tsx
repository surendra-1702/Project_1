import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, TrendingUp, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  usersByGoal: Record<string, number>;
  recentLogins: Array<{
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    lastLoginAt: string;
  }>;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
  activityLevel: string;
  fitnessGoal: string;
  role: string;
  lastLoginAt: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: user?.role === 'admin'
  });

  const { data: users, isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === 'admin'
  });

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-500">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (statsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityBadge = (lastLogin: string) => {
    const loginDate = new Date(lastLogin);
    const daysSinceLogin = Math.floor((Date.now() - loginDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLogin <= 1) {
      return <Badge variant="default" className="bg-green-500">Active</Badge>;
    } else if (daysSinceLogin <= 7) {
      return <Badge variant="secondary">Recent</Badge>;
    } else {
      return <Badge variant="outline">Inactive</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="outline">Admin View</Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Logged in within 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Active / Total users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fitness Goals Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Fitness Goals Distribution</CardTitle>
          <CardDescription>How users are distributed across different fitness goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats?.usersByGoal && Object.entries(stats.usersByGoal).map(([goal, count]) => (
              <div key={goal} className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {goal.replace('-', ' ')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Logins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent User Activity
          </CardTitle>
          <CardDescription>Latest user logins and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentLogins && stats.recentLogins.length > 0 ? (
              stats.recentLogins.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {user.firstName?.[0] || user.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.firstName} {user.lastName} (@{user.username})
                      </div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getActivityBadge(user.lastLoginAt)}
                    <div className="text-sm text-muted-foreground">
                      {formatDate(user.lastLoginAt)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No recent login activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Complete list of registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Fitness Goal</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-muted-foreground">@{user.username}</div>
                        </div>
                      </td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-2 capitalize">
                        {user.fitnessGoal ? user.fitnessGoal.replace('-', ' ') : 'Not set'}
                      </td>
                      <td className="p-2">
                        {user.lastLoginAt ? getActivityBadge(user.lastLoginAt) : 
                          <Badge variant="outline">Never logged in</Badge>
                        }
                      </td>
                      <td className="p-2">
                        {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}