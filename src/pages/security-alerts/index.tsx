import {
  AlertOutlined,
  CameraOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Card,
  Col,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Typography,
} from 'antd';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

interface AlertData {
  id: number;
  camera: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  time: string;
  image: string;
}

const alertData: AlertData[] = [
  {
    id: 1,
    camera: 'Lobby',
    severity: 'High',
    time: '2025-02-22 14:30',
    image: '/api/placeholder/400/300',
  },
  {
    id: 2,
    camera: 'Parking Lot',
    severity: 'Medium',
    time: '2025-02-22 14:10',
    image: '/api/placeholder/400/300',
  },
  {
    id: 3,
    camera: 'Main Entrance',
    severity: 'Low',
    time: '2025-02-22 13:50',
    image: '/api/placeholder/400/300',
  },
  {
    id: 4,
    camera: 'Server Room',
    severity: 'Critical',
    time: '2025-02-22 13:30',
    image: '/api/placeholder/400/300',
  },
  {
    id: 5,
    camera: 'Back Entrance',
    severity: 'High',
    time: '2025-02-22 13:15',
    image: '/api/placeholder/400/300',
  },
];

const severityColors: Record<AlertData['severity'], string> = {
  Critical: '#ff4d4f',
  High: '#ff7a45',
  Medium: '#ffa940',
  Low: '#52c41a',
};

const chartData = Object.entries(
  alertData.reduce<Record<string, number>>((acc, { severity }) => {
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));

export default function SecurityAlertsPage() {
  const [filteredData, setFilteredData] = useState<AlertData[]>(alertData);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSearch = (value: string) => {
    setFilteredData(
      alertData.filter((item) =>
        item.camera.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleFilter = (value: AlertData['severity'] | undefined) => {
    setFilteredData(
      value ? alertData.filter((item) => item.severity === value) : alertData
    );
  };

  const columns = [
    {
      title: 'Camera',
      dataIndex: 'camera',
      key: 'camera',
      render: (text: string, record: AlertData) => (
        <Space>
          <CameraOutlined style={{ color: severityColors[record.severity] }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: AlertData['severity']) => (
        <Badge
          color={severityColors[severity]}
          text={severity}
        />
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <Avatar
          src={image}
          shape="square"
          size={64}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSelectedImage(image);
            setModalVisible(true);
          }}
        />
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <Row
          gutter={[16, 16]}
          style={{ marginBottom: 24 }}>
          {Object.entries(severityColors).map(([severity, color]) => (
            <Col
              xs={24}
              sm={12}
              md={6}
              key={severity}>
              <Card>
                <Statistic
                  title={`${severity} Alerts`}
                  value={chartData.find((d) => d.name === severity)?.value || 0}
                  valueStyle={{ color }}
                  prefix={<AlertOutlined />}
                />
              </Card>
            </Col>
          ))}
        </Row>
        {/* Charts */}
        <Row
          gutter={[16, 16]}
          style={{ marginBottom: 24 }}>
          <Col
            xs={24}
            md={12}>
            <Card title="Alert Severity Distribution">
              <ResponsiveContainer
                width="100%"
                height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}>
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={severityColors[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col
            xs={24}
            md={12}>
            <Card title="Alerts by Location">
              <ResponsiveContainer
                width="100%"
                height={300}>
                <BarChart data={alertData}>
                  <XAxis dataKey="camera" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="id"
                    fill="#1890ff"
                    name="Alert Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
        <Card>
          <Space style={{ marginBottom: 16 }}>
            <Search
              placeholder="Search by camera"
              onSearch={handleSearch}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              placeholder="Filter by severity"
              onChange={handleFilter}
              style={{ width: 150 }}
              allowClear>
              {Object.keys(severityColors).map((level) => (
                <Option
                  key={level}
                  value={level}>
                  <Badge
                    color={severityColors[level as AlertData['severity']]}
                    text={level}
                  />
                </Option>
              ))}
            </Select>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 5 }}
          />
        </Card>

        <Modal
          open={modalVisible}
          footer={null}
          onCancel={() => setModalVisible(false)}
          width={800}
          centered>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Alert"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </Modal>
      </Content>
    </Layout>
  );
}
