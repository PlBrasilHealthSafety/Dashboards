import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CustomLineChart,
  CustomBarChart,
  CustomPieChart,
  MultiLineChart
} from '@/components/custom/Charts';

// Mock data for demonstrations
const salesData = [
  { month: 'Jan', sales: 4000, revenue: 2400, profit: 1600 },
  { month: 'Feb', sales: 3000, revenue: 1398, profit: 1200 },
  { month: 'Mar', sales: 2000, revenue: 9800, profit: 2800 },
  { month: 'Apr', sales: 2780, revenue: 3908, profit: 2000 },
  { month: 'May', sales: 1890, revenue: 4800, profit: 2181 },
  { month: 'Jun', sales: 2390, revenue: 3800, profit: 2500 },
  { month: 'Jul', sales: 3490, revenue: 4300, profit: 2100 },
];

const userGrowthData = [
  { month: 'Jan', users: 1200 },
  { month: 'Feb', users: 1900 },
  { month: 'Mar', users: 2800 },
  { month: 'Apr', users: 3900 },
  { month: 'May', users: 4800 },
  { month: 'Jun', users: 5800 },
  { month: 'Jul', users: 6900 },
];

const categoryData = [
  { name: 'Technology', value: 35 },
  { name: 'Marketing', value: 25 },
  { name: 'Sales', value: 20 },
  { name: 'Support', value: 15 },
  { name: 'Operations', value: 5 },
];

const performanceData = [
  { month: 'Jan', performance: 85, target: 90, satisfaction: 78 },
  { month: 'Feb', performance: 88, target: 90, satisfaction: 82 },
  { month: 'Mar', performance: 92, target: 90, satisfaction: 85 },
  { month: 'Apr', performance: 89, target: 90, satisfaction: 88 },
  { month: 'May', performance: 94, target: 90, satisfaction: 91 },
  { month: 'Jun', performance: 96, target: 90, satisfaction: 89 },
  { month: 'Jul', performance: 93, target: 90, satisfaction: 92 },
];

export function ChartsExample() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Charts Dashboard</h1>
        <p className="text-muted-foreground">
          Interactive charts built with Recharts and styled with our design system
        </p>
      </div>

      {/* Line Chart Example */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth Trend</CardTitle>
          <CardDescription>
            Monthly active users over the past 7 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomLineChart
            data={userGrowthData}
            xKey="month"
            yKey="users"
            height={350}
          />
        </CardContent>
      </Card>

      {/* Bar Chart Example */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Performance</CardTitle>
          <CardDescription>
            Sales figures for each month showing revenue trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomBarChart
            data={salesData}
            xKey="month"
            yKey="sales"
            height={350}
          />
        </CardContent>
      </Card>

      {/* Pie Chart Example */}
      <Card>
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
          <CardDescription>
            Breakdown of resources by department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomPieChart
            data={categoryData}
            height={400}
          />
        </CardContent>
      </Card>

      {/* Multi-line Chart Example */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Comparison of performance, targets, and satisfaction scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MultiLineChart
            data={performanceData}
            xKey="month"
            lines={[
              { key: 'performance', name: 'Performance', color: 'hsl(var(--primary))' },
              { key: 'target', name: 'Target', color: 'hsl(var(--secondary))' },
              { key: 'satisfaction', name: 'Satisfaction', color: '#10b981' },
            ]}
            height={350}
          />
        </CardContent>
      </Card>

      {/* Grid Layout Example */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue growth</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomLineChart
              data={salesData}
              xKey="month"
              yKey="revenue"
              height={250}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Analysis</CardTitle>
            <CardDescription>Monthly profit margins</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomBarChart
              data={salesData}
              xKey="month"
              yKey="profit"
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomPieChart
              data={categoryData.slice(0, 3)}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomLineChart
              data={userGrowthData.slice(-4)}
              xKey="month"
              yKey="users"
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomBarChart
              data={performanceData.slice(-4)}
              xKey="month"
              yKey="performance"
              height={200}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}