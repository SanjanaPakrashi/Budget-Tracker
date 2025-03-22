import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("Current Path:", location.pathname);
  }, [location]);

  return (
    <Layout>
      <h1>Welcome to Index Page</h1>
      <Dashboard />
    </Layout>
  );
};

export default Index;
