
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import { getCustomersStats } from "@/services/customerService";
import { Users, Crown, Timer, CreditCard } from "lucide-react";

interface StatsData {
  total: number;
  gold: number;
  platinum: number;
  diamond: number;
  expiringSoon: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    gold: 0,
    platinum: 0,
    diamond: 0,
    expiringSoon: 0
  });

  useEffect(() => {
    const statsData = getCustomersStats();
    setStats(statsData);
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-gray-500">Manage your premium lounge members</p>
        </div>
        <Button 
          className="bg-secondary hover:bg-secondary/90"
          onClick={() => navigate("/customers/new")}
        >
          Add New Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
        <StatsCard 
          title="Total Members" 
          value={stats.total} 
          icon={<Users />} 
        />
        <StatsCard 
          title="Gold Members" 
          value={stats.gold} 
          icon={<CreditCard />}
          className="border-l-4 border-yellow-400"
        />
        <StatsCard 
          title="Platinum Members" 
          value={stats.platinum} 
          icon={<CreditCard />}
          className="border-l-4 border-gray-400"
        />
        <StatsCard 
          title="Diamond Members" 
          value={stats.diamond} 
          icon={<Crown />}
          className="border-l-4 border-blue-400"
        />
        <StatsCard 
          title="Expiring Soon" 
          value={stats.expiringSoon} 
          icon={<Timer />}
          className="border-l-4 border-red-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lounge-card">
          <h2 className="text-xl font-semibold text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Button
              variant="outline" 
              className="justify-start"
              onClick={() => navigate("/customers")}
            >
              <Users className="mr-2 h-4 w-4" /> View All Customers
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate("/customers/new")}
            >
              <Users className="mr-2 h-4 w-4" /> Add New Customer
            </Button>
          </div>
        </div>

        <div className="lounge-card">
          <h2 className="text-xl font-semibold text-primary mb-4">About FCB Airport Lounge</h2>
          <p className="text-gray-600">
            Welcome to the FCB AirLounge management portal. Here you can manage all your premium members, 
            create digital membership cards, and keep track of your customers' information.
          </p>
          <div className="flex space-x-2 mt-4">
            <div className="h-6 w-6 rounded-full bg-[#112369]"></div>
            <div className="h-6 w-6 rounded-full bg-[#8dc63f]"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
