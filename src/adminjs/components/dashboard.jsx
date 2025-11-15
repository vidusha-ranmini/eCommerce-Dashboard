import React, { useEffect, useState } from 'react';
import { Box, H2, H3, H5, Table, TableHead, TableBody, TableRow, TableCell, Badge, Text } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import { useTranslation } from 'adminjs';

const api = new ApiClient();

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the correct API method - getDashboardData fetches from the dashboard handler
        const response = await api.getDashboard();
        console.log('Dashboard response:', response);
        setData(response.data || response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box p="xl">
        <H3>Loading dashboard...</H3>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="xl">
        <H3 style={{ color: '#ff4444' }}>Error loading dashboard</H3>
        <Text>{error}</Text>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p="xl">
        <H3>No data available</H3>
      </Box>
    );
  }

  const { welcome, stats, ordersByStatus, recentOrders, lowStockProducts, topProducts } = data;
  const isAdmin = lowStockProducts !== undefined;

  return (
    <Box>
      {/* Welcome Section */}
      <Box mb="xl" p="xl" bg="white" border="default" borderRadius="default">
        <H2 mb="default">{welcome?.message || 'Welcome to Dashboard'}</H2>
        <Text fontSize="lg">
          Hello, <strong>{welcome?.name}</strong> - {welcome?.role}
        </Text>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Box display="flex" flexWrap="wrap" mb="xl">
          {Object.entries(stats).map(([key, stat]) => (
            <Box
              key={key}
              flex="1"
              minWidth="200px"
              m="default"
              p="xl"
              bg="white"
              border="default"
              borderRadius="default"
            >
              <H5 mb="default">{stat.label}</H5>
              <Text fontSize="xxl" fontWeight="bold">{stat.value}</Text>
            </Box>
          ))}
        </Box>
      )}

      {/* Charts Row */}
      <Box display="flex" flexWrap="wrap" mb="xl">
        {/* Orders by Status */}
        {ordersByStatus && Object.keys(ordersByStatus).length > 0 && (
          <Box
            flex="1"
            minWidth="300px"
            m="default"
            p="xl"
            bg="white"
            border="default"
            borderRadius="default"
          >
            <H5 mb="lg">Orders by Status</H5>
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <Box key={status} display="flex" justifyContent="space-between" alignItems="center" mb="default">
                <Text style={{ textTransform: 'capitalize' }}>{status}</Text>
                <Badge variant={status === 'delivered' ? 'success' : status === 'cancelled' ? 'danger' : 'primary'}>
                  {count}
                </Badge>
              </Box>
            ))}
          </Box>
        )}

        {/* Top Products */}
        {topProducts && topProducts.length > 0 && (
          <Box
            flex="1"
            minWidth="400px"
            m="default"
            p="xl"
            bg="white"
            border="default"
            borderRadius="default"
          >
            <H5 mb="lg">Top Selling Products</H5>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  {topProducts[0]?.totalRevenue && <TableCell>Revenue</TableCell>}
                  {topProducts[0]?.price && <TableCell>Price</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {topProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Text fontWeight="bold">{product.name}</Text>
                      <Text fontSize="sm">{product.sku}</Text>
                    </TableCell>
                    <TableCell>
                      <Badge variant="primary">{product.totalQuantity}</Badge>
                    </TableCell>
                    {product.totalRevenue && <TableCell>${product.totalRevenue}</TableCell>}
                    {product.price && <TableCell>${product.price}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Low Stock Products (Admin Only) */}
      {isAdmin && lowStockProducts && lowStockProducts.length > 0 && (
        <Box mb="xl" p="xl" bg="white" border="default" borderRadius="default">
          <H5 mb="lg" style={{ color: '#ff4444' }}>⚠️ Low Stock Alert</H5>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Current Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowStockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell><Text fontSize="sm">{product.sku}</Text></TableCell>
                  <TableCell>
                    <Badge variant="danger">{product.stock} units</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Recent Orders */}
      {recentOrders && recentOrders.length > 0 && (
        <Box bg="white" border="default" borderRadius="default" p="xl">
          <H5 mb="lg">Recent Orders</H5>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                {recentOrders[0]?.userName && <TableCell>Customer</TableCell>}
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                {recentOrders[0]?.paymentStatus && <TableCell>Payment</TableCell>}
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Text fontWeight="bold">{order.orderNumber}</Text>
                  </TableCell>
                  {order.userName && (
                    <TableCell>
                      <Text>{order.userName}</Text>
                      <Text fontSize="sm">{order.userEmail}</Text>
                    </TableCell>
                  )}
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'cancelled' ? 'danger' :
                        order.status === 'shipped' ? 'info' :
                        'primary'
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  {order.paymentStatus && (
                    <TableCell>
                      <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'default'}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    <Text fontSize="sm">{new Date(order.createdAt).toLocaleDateString()}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;