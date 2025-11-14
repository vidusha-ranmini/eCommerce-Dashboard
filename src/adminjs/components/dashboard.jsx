import React, { useEffect, useState } from 'react';
import { Box, H3, H5, Table, TableHead, TableBody, TableRow, TableCell, Badge, Text } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getDashboard();
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Box p="xl"><Text>Loading...</Text></Box>;
  }

  if (!data) {
    return <Box p="xl"><Text>No data available</Text></Box>;
  }

  const isAdmin = data.stats && 'totalUsers' in data.stats;

  return (
    <Box p="xl">
      <H3 mb="xl">Dashboard</H3>
      
      {isAdmin ? (
        <>
          {/* Admin Dashboard */}
          <Box display="flex" flexWrap="wrap" mb="xl">
            <Box
              flex="1"
              minWidth="200px"
              m="default"
              p="xl"
              bg="white"
              border="default"
              borderRadius="default"
            >
              <H5 mb="default">Total Users</H5>
              <Text fontSize="xxl" fontWeight="bold">{data.stats.totalUsers}</Text>
            </Box>
            
            <Box
              flex="1"
              minWidth="200px"
              m="default"
              p="xl"
              bg="white"
              border="default"
              borderRadius="default"
            >
              <H5 mb="default">Total Products</H5>
              <Text fontSize="xxl" fontWeight="bold">{data.stats.totalProducts}</Text>
            </Box>
            
            <Box
              flex="1"
              minWidth="200px"
              m="default"
              p="xl"
              bg="white"
              border="default"
              borderRadius="default"
            >
              <H5 mb="default">Total Orders</H5>
              <Text fontSize="xxl" fontWeight="bold">{data.stats.totalOrders}</Text>
            </Box>
            
            <Box
              flex="1"
              minWidth="200px"
              m="default"
              p="xl"
              bg="white"
              border="default"
              borderRadius="default"
            >
              <H5 mb="default">Total Revenue</H5>
              <Text fontSize="xxl" fontWeight="bold">${parseFloat(data.stats.totalRevenue).toFixed(2)}</Text>
            </Box>
          </Box>

          <Box bg="white" border="default" borderRadius="default" p="xl">
            <H5 mb="lg">Recent Orders</H5>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>${parseFloat(order.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'delivered' ? 'success' : 'primary'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </>
      ) : (
        <>
          {/* User Dashboard */}
          <Box mb="xl" bg="white" border="default" borderRadius="default" p="xl">
            <H5 mb="default">Welcome, {data.userInfo.name}!</H5>
            <Text>Email: {data.userInfo.email}</Text>
            <Text>Role: {data.userInfo.role}</Text>
          </Box>

          <Box display="flex" flexWrap="wrap" mb="xl">
            <Box
              flex="1"
              minWidth="200px"
              m="default"
              p="xl"
              bg="white"
              border="default"
              borderRadius="default"
            >
              <H5 mb="default">My Orders</H5>
              <Text fontSize="xxl" fontWeight="bold">{data.stats.totalOrders}</Text>
            </Box>
            
            <Box
              flex="1"
              minWidth="200px"
              m="default"
              p="xl"
              bg="white"
              border="default"
              borderRadius="default"
            >
              <H5 mb="default">Total Spent</H5>
              <Text fontSize="xxl" fontWeight="bold">${parseFloat(data.stats.totalSpent).toFixed(2)}</Text>
            </Box>
          </Box>

          <Box bg="white" border="default" borderRadius="default" p="xl">
            <H5 mb="lg">My Recent Orders</H5>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>${parseFloat(order.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'delivered' ? 'success' : 'primary'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
