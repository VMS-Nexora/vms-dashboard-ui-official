import { Column, DualAxes, Line, Pie } from '@ant-design/charts';
import { RiseOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import {
  Badge,
  Card,
  Col,
  DatePicker,
  Row,
  Segmented,
  Statistic,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

// Expanded interfaces
interface VisitorData {
  date: string;
  value: number;
  category: string;
}

interface VisitorDistributionData {
  type: string;
  value: number;
}

interface TopHostData {
  key: string;
  rank: number;
  name: string;
  company: string;
  totalVisitors: number;
  averageMeetingTime: number;
}

interface TopVisitorData {
  key: string;
  rank: number;
  name: string;
  company: string;
  totalVisits: number;
  lastVisit: string;
}

interface AlertData {
  id: number;
  type: 'High' | 'Medium' | 'Low';
  description: string;
  count: number;
  impact: string;
}
const categories = ['Walk-in', 'Appointment', 'Event'];
// Enhanced mock data generation
const generateMockData = () => {
  const trendData: VisitorData[] = [];

  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    categories.forEach((category) => {
      trendData.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 50) + 10,
        category,
      });
    });
  }

  const distributionData: VisitorDistributionData[] = [
    { type: 'Clients', value: 428 },
    { type: 'Vendors', value: 253 },
    { type: 'Interview', value: 187 },
    { type: 'Personal', value: 145 },
    { type: 'Event', value: 209 },
  ];

  const companies = [
    'Company A',
    'Company B',
    'Company C',
    'Company D',
    'Company E',
  ];

  const topHosts: TopHostData[] = Array.from({ length: 10 }, (_, i) => ({
    key: `host-${i}`,
    rank: i + 1,
    name: `John Doe ${i}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    totalVisitors: Math.floor(Math.random() * 100) + 50,
    averageMeetingTime: Math.floor(Math.random() * 60) + 15,
  }));

  const visitorCompanies = [
    'Acme Corp',
    'Globex',
    'Initech',
    'Umbrella',
    'Stark Industries',
    'Wayne Enterprises',
    'LexCorp',
    'Cyberdyne',
    'Oscorp',
    'Massive Dynamic',
  ];

  const topVisitors: TopVisitorData[] = Array.from({ length: 10 }, (_, i) => ({
    key: `visitor-${i}`,
    rank: i + 1,
    name: `Alice Smith ${i}`,
    company:
      visitorCompanies[Math.floor(Math.random() * visitorCompanies.length)],
    totalVisits: Math.floor(Math.random() * 15) + 5,
    lastVisit: new Date(
      now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T')[0],
  }));

  // Alert data
  const alertData: AlertData[] = [
    {
      id: 1,
      type: 'High',
      description: 'Unidentified visitors in secure areas',
      count: 12,
      impact: 'Security breach risk',
    },
    {
      id: 2,
      type: 'High',
      description: 'Multiple failed check-in attempts',
      count: 8,
      impact: 'Potential unauthorized access',
    },
    {
      id: 3,
      type: 'Medium',
      description: 'Extended visitor stays past permitted hours',
      count: 23,
      impact: 'Policy violation',
    },
    {
      id: 4,
      type: 'Medium',
      description: 'Missing visitor information',
      count: 31,
      impact: 'Compliance issues',
    },
    {
      id: 5,
      type: 'Low',
      description: 'Duplicate visitor entries',
      count: 42,
      impact: 'Data quality issue',
    },
    {
      id: 6,
      type: 'Low',
      description: 'Incomplete check-out process',
      count: 56,
      impact: 'Inaccurate occupancy tracking',
    },
  ];

  const visitorsByHourData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    visitors: Math.floor(Math.random() * 30) + (i >= 8 && i <= 17 ? 20 : 5),
  }));

  return {
    trendData,
    distributionData,
    topHosts,
    topVisitors,
    alertData,
    visitorsByHourData,
  };
};

const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>(
    'month'
  );
  const {
    trendData,
    distributionData,
    topHosts,
    topVisitors,
    alertData,
    visitorsByHourData,
  } = generateMockData();
  const [filteredTrendData, setFilteredTrendData] =
    useState<VisitorData[]>(trendData);

  // Table columns
  const hostColumns: ColumnsType<TopHostData> = [
    { title: 'Rank', dataIndex: 'rank', key: 'rank', width: 70 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Company', dataIndex: 'company', key: 'company' },
    {
      title: 'Total Visitors',
      dataIndex: 'totalVisitors',
      key: 'totalVisitors',
      sorter: (a, b) => a.totalVisitors - b.totalVisitors,
    },
    {
      title: 'Avg. Meeting (min)',
      dataIndex: 'averageMeetingTime',
      key: 'averageMeetingTime',
    },
  ];

  const visitorColumns: ColumnsType<TopVisitorData> = [
    { title: 'Rank', dataIndex: 'rank', key: 'rank', width: 70 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Company', dataIndex: 'company', key: 'company' },
    {
      title: 'Total Visits',
      dataIndex: 'totalVisits',
      key: 'totalVisits',
      sorter: (a, b) => a.totalVisits - b.totalVisits,
    },
    { title: 'Last Visit', dataIndex: 'lastVisit', key: 'lastVisit' },
  ];

  const alertColumns: ColumnsType<AlertData> = [
    {
      title: 'Severity',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const color =
          type === 'High' ? 'red' : type === 'Medium' ? 'orange' : 'yellow';
        return (
          <Badge
            color={color}
            text={type}
          />
        );
      },
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Count', dataIndex: 'count', key: 'count' },
    { title: 'Potential Impact', dataIndex: 'impact', key: 'impact' },
  ];

  // Prepare data for charts
  const pieConfig = {
    data: distributionData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  // 1. Visitor Source Companies
  const visitorCompanyData = topVisitors.reduce((acc, visitor) => {
    acc[visitor.company] = (acc[visitor.company] || 0) + visitor.totalVisits;
    return acc;
  }, {} as Record<string, number>);

  const visitorSourceData = Object.entries(visitorCompanyData)
    .map(([company, visits]) => ({ company, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 7); // Top 7 companies

  const visitorSourceConfig = {
    data: visitorSourceData,
    xField: 'company',
    yField: 'visits',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  // 2. Host Companies
  const hostCompanyData = topHosts.reduce((acc, host) => {
    acc[host.company] = (acc[host.company] || 0) + host.totalVisitors;
    return acc;
  }, {} as Record<string, number>);

  const hostCompanyChartData = Object.entries(hostCompanyData).map(
    ([company, visitors]) => ({ company, visitors })
  );

  const hostCompanyPieConfig = {
    data: hostCompanyChartData,
    angleField: 'visitors',
    colorField: 'company',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  // 3. Visitor by Hour distribution
  const hourlyVisitorConfig = {
    data: visitorsByHourData,
    xField: 'hour',
    yField: 'visitors',
    label: false,
    xAxis: {
      title: { text: 'Hour of Day' },
      tickInterval: 2,
    },
    yAxis: {
      title: { text: 'Average Visitors' },
    },
  };

  // 4. Alert summary data
  const alertSummary = alertData.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + alert.count;
    return acc;
  }, {} as Record<string, number>);

  const alertChartData = Object.entries(alertSummary).map(([type, count]) => ({
    type,
    count,
  }));

  const alertPieConfig = {
    data: alertChartData,
    angleField: 'count',
    colorField: 'type',
    radius: 0.8,
    legend: { position: 'right' },
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
    },
    interactions: [{ type: 'element-active' }],
  };

  // 5. Weekly vs Monthly comparison data
  const getVisitorsByDateRange = (days: number) => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);

    return trendData
      .filter((item) => new Date(item.date) >= startDate)
      .reduce((sum, item) => sum + item.value, 0);
  };

  const comparisonData = [
    { type: 'This Week', value: getVisitorsByDateRange(7) },
    {
      type: 'Last Week',
      value: getVisitorsByDateRange(14) - getVisitorsByDateRange(7),
    },
    { type: 'This Month', value: getVisitorsByDateRange(30) },
    {
      type: 'Last Month',
      value: getVisitorsByDateRange(60) - getVisitorsByDateRange(30),
    },
  ];

  const dualAxesData = [
    ['This Week', 'Last Week', 'This Month', 'Last Month'].map((period) => ({
      period,
      visitors: comparisonData.find((d) => d.type === period)?.value || 0,
    })),
    ['This Week', 'Last Week', 'This Month', 'Last Month'].map((period) => ({
      period,
      growth:
        period === 'This Week'
          ? ((comparisonData.find((d) => d.type === 'This Week')?.value || 0) /
              (comparisonData.find((d) => d.type === 'Last Week')?.value ||
                1)) *
              100 -
            100
          : period === 'This Month'
          ? ((comparisonData.find((d) => d.type === 'This Month')?.value || 0) /
              (comparisonData.find((d) => d.type === 'Last Month')?.value ||
                1)) *
              100 -
            100
          : 0,
    })),
  ];

  const dualAxesConfig = {
    data: dualAxesData,
    xField: 'period',
    yField: ['visitors', 'growth'],
    yAxis: {
      visitors: {
        title: {
          text: 'Total Visitors',
        },
      },
      growth: {
        title: {
          text: 'Growth Rate (%)',
        },
      },
    },
    geometryOptions: [
      {
        geometry: 'column',
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 2,
        },
      },
    ],
  };

  // 6. Visitor trend by category
  const getTrendDataByCategoryAndTimePeriod = (
    category: string,
    days: number
  ) => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);

    return trendData
      .filter(
        (item) => item.category === category && new Date(item.date) >= startDate
      )
      .reduce((acc, item) => {
        const date = item.date;
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += item.value;
        return acc;
      }, {} as Record<string, number>);
  };

  const categoryTrendData = categories.flatMap((category) => {
    const categoryData = getTrendDataByCategoryAndTimePeriod(category, 30);
    return Object.entries(categoryData).map(([date, value]) => ({
      date,
      value,
      category,
    }));
  });

  const categoryTrendConfig = {
    data: categoryTrendData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    legend: { position: 'top' },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const timeRangeChange = (value: 'week' | 'month' | 'quarter') => {
    setTimeRange(value);
    const now = new Date();
    const startDate = new Date(now);

    switch (value) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'quarter':
        startDate.setDate(now.getDate() - 90);
        break;
    }

    const filtered = trendData.filter(
      (item) => new Date(item.date) >= startDate && new Date(item.date) <= now
    );
    setFilteredTrendData(filtered);
  };

  const handleRangeChange = (range: [string, string]) => {
    const [start, end] = range;
    const filtered = trendData.filter(
      (item) => item.date >= start && item.date <= end
    );
    setFilteredTrendData(filtered);
  };

  useEffect(() => {
    timeRangeChange('month');
  }, []);

  // Calculate summary statistics
  const totalVisitors = filteredTrendData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const avgDailyVisitors = Math.round(
    totalVisitors / (filteredTrendData.length / 3)
  );
  const maxDailyVisitors = Math.max(
    ...filteredTrendData.map((item) => item.value)
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <>
        <Row gutter={[16, 16]}>
          <Col
            xs={24}
            md={8}>
            <Card>
              <Statistic
                title="Total Visitors"
                value={totalVisitors}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col
            xs={24}
            md={8}>
            <Card>
              <Statistic
                title="Average Daily Visitors"
                value={avgDailyVisitors}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col
            xs={24}
            md={8}>
            <Card>
              <Statistic
                title="Peak Daily Visitors"
                value={maxDailyVisitors}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Chart 1 & 2: Visitor Distribution and Visitor Source Companies */}
        <Row
          gutter={[16, 16]}
          style={{ marginTop: 16 }}>
          <Col
            xs={24}
            md={12}>
            <Card title="Visitor Type Distribution">
              <Pie
                {...pieConfig}
                height={300}
              />
            </Card>
          </Col>
          <Col
            xs={24}
            md={12}>
            <Card title="Top Visitor Source Companies">
              <Column
                {...visitorSourceConfig}
                height={300}
              />
            </Card>
          </Col>
        </Row>

        {/* Chart 3 & 4: Host Companies and Hourly Distribution */}
        <Row
          gutter={[16, 16]}
          style={{ marginTop: 16 }}>
          <Col
            xs={24}
            md={12}>
            <Card title="Host Company Distribution">
              <Pie
                {...hostCompanyPieConfig}
                height={300}
              />
            </Card>
          </Col>
          <Col
            xs={24}
            md={12}>
            <Card title="Visitor Distribution by Hour">
              <Column
                {...hourlyVisitorConfig}
                height={300}
              />
            </Card>
          </Col>
        </Row>

        {/* Chart 5 & 6: Alert Distribution and Period Comparison */}
        <Row
          gutter={[16, 16]}
          style={{ marginTop: 16 }}>
          <Col
            xs={24}
            md={12}>
            <Card title="Alert Distribution by Severity">
              <Pie
                {...alertPieConfig}
                height={300}
              />
            </Card>
          </Col>
          <Col
            xs={24}
            md={12}>
            <Card
              title="Visitor Trends Comparison"
              extra={
                <Segmented
                  options={[
                    { label: 'Week', value: 'week' },
                    { label: 'Month', value: 'month' },
                    { label: 'Quarter', value: 'quarter' },
                  ]}
                  value={timeRange}
                  onChange={(value) =>
                    timeRangeChange(value as 'week' | 'month' | 'quarter')
                  }
                />
              }>
              <DualAxes
                {...dualAxesConfig}
                height={300}
              />
            </Card>
          </Col>
        </Row>

        {/* Chart 7: Category Trend Line */}
        <Row
          gutter={[16, 16]}
          style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card
              title="Visitor Trend by Category"
              extra={
                <RangePicker
                  onChange={(_, dateStrings) =>
                    handleRangeChange(dateStrings as [string, string])
                  }
                />
              }>
              <Line
                {...categoryTrendConfig}
                height={300}
              />
            </Card>
          </Col>
        </Row>

        <Row
          gutter={[16, 16]}
          style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="Security & Compliance Alerts">
              <Table
                size="small"
                columns={alertColumns}
                dataSource={alertData}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>

        <Row
          gutter={[16, 16]}
          style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="Top Hosts Ranking">
              <Table
                size="small"
                columns={hostColumns}
                dataSource={topHosts}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>

        <Row
          gutter={[16, 16]}
          style={{ marginTop: 16, marginBottom: 16 }}>
          <Col span={24}>
            <Card title="Top Visitors Ranking">
              <Table
                size="small"
                columns={visitorColumns}
                dataSource={topVisitors}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>
      </>
    </div>
  );
};

export default DashboardPage;
