
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";
import { getCustomerById, getQRCodeValue } from "@/services/customerService";
import { ArrowLeft, Crown, Download, CircleDot } from "lucide-react";
import QRCode from "@/components/QRCode";
import { toast } from "sonner";
import html2canvas from "html2canvas";

const DigitalCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [qrValue, setQrValue] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      const customerData = getCustomerById(id);
      if (customerData) {
        setCustomer(customerData);
        // Get the QR code value for this customer using the updated function
        const qrCodeValue = getQRCodeValue(id);
        console.log("Generated QR code value:", qrCodeValue); // Debug log
        setQrValue(qrCodeValue);
      } else {
        toast.error("Customer not found");
        navigate("/customers");
      }
    }
  }, [id, navigate]);

  const getMembershipIcon = () => {
    switch (customer?.membershipType) {
      case "gold":
        return <div className="w-6 h-6 rounded-full bg-yellow-500" />;
      case "platinum":
        return <div className="w-6 h-6 rounded-full bg-gray-400" />;
      case "diamond":
        return <Crown className="w-6 h-6 text-blue-400" />;
      default:
        return null;
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current || !customer) return;
    
    try {
      setIsDownloading(true);
      toast.info("Preparing download...");
      
      // Wait a small amount of time to ensure the UI is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "transparent", // Use transparent to keep the gradient
        scale: 3, // Higher resolution for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        removeContainer: true
      });
      
      const imageData = canvas.toDataURL("image/png", 1.0);
      
      // Create a download link
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `${customer.lastName}-${customer.firstName}-membership-card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Card downloaded successfully");
    } catch (error) {
      console.error("Error downloading card:", error);
      toast.error("Failed to download card");
    } finally {
      setIsDownloading(false);
    }
  };

  // Custom branded gradient using the specific colors provided
  const getCardBackground = () => {
    // These are the exact colors provided in the requirements
    return "linear-gradient(135deg, #112369 0%, #8dc63f 100%)";
  };

  return (
    <Layout>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft className="h-5 w-5 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-primary">Digital Membership Card</h1>
          <p className="text-gray-500">
            {customer
              ? `${customer.firstName} ${customer.lastName}'s membership card`
              : "Loading..."}
          </p>
        </div>
      </div>

      {customer ? (
        <div className="flex flex-col items-center">
          <div className="membership-card max-w-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
            <div 
              ref={cardRef} 
              className="membership-card-content relative p-6 min-h-[220px] text-white rounded-lg shadow-lg"
              style={{ background: getCardBackground() }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm opacity-70">FCB Airport Premium Lounge</div>
                  <h2 className="text-xl font-bold">
                    {customer.firstName} {customer.lastName}
                  </h2>
                </div>
                <div className="flex space-x-1 items-center">
                  {getMembershipIcon()}
                  <span className="text-xs uppercase bg-white/20 px-2 py-1 rounded">
                    {customer.membershipType}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-sm opacity-70 pr-32">
                <div>Member since: {new Date(customer.createdAt).toLocaleDateString()}</div>
                <div>Expires: {new Date(customer.expiryDate).toLocaleDateString()}</div>
                <div className="mt-1 font-mono">ID: {customer.membershipNumber}</div>
                <div className="mt-3 flex items-center">
                  <CircleDot className="h-4 w-4 mr-2" /> 
                  <span>Visits: {customer.visits}</span>
                </div>
              </div>

              <div className="absolute right-6 bottom-6 bg-white p-2 rounded-lg shadow-md">
                <QRCode value={qrValue} size={80} />
              </div>
            </div>
          </div>

          <div className="mt-8 mb-6 flex flex-col items-center p-4">
            <h3 className="text-lg font-semibold mb-4 text-primary">Scan this QR code for quick access</h3>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <QRCode value={qrValue} size={200} />
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Each QR code is uniquely linked to the customer's membership details
            </p>
            <Button 
              className="mt-6" 
              variant="outline" 
              onClick={downloadCard} 
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-2" /> 
              {isDownloading ? "Processing..." : "Download Card"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">Loading...</div>
      )}
    </Layout>
  );
};

export default DigitalCard;
