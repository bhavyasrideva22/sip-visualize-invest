
import React, { useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Mail, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from "@/hooks/use-toast";

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [years, setYears] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const { toast } = useToast();

  const calculateSIP = useCallback(() => {
    const monthlyRate = expectedReturn / (12 * 100);
    const months = years * 12;
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = monthlyInvestment * months;
    const totalReturns = futureValue - totalInvestment;
    
    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns)
    };
  }, [monthlyInvestment, years, expectedReturn]);

  const generateChartData = useCallback(() => {
    const data = [];
    for (let y = 0; y <= years; y++) {
      const monthlyRate = expectedReturn / (12 * 100);
      const months = y * 12;
      const invested = monthlyInvestment * months;
      const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      
      data.push({
        year: y,
        value: Math.round(futureValue),
        invested: Math.round(invested)
      });
    }
    return data;
  }, [monthlyInvestment, years, expectedReturn]);

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your SIP calculation report is being generated.",
    });
  };

  const handleEmail = () => {
    toast({
      title: "Email Feature",
      description: "Email functionality will be implemented soon.",
    });
  };

  const { futureValue, totalInvestment, totalReturns } = calculateSIP();
  const chartData = generateChartData();
  const pieData = [
    { name: "Total Investment", value: totalInvestment },
    { name: "Total Returns", value: totalReturns }
  ];
  const COLORS = ['#245e4f', '#7ac9a7'];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-semibold text-charcoal">SIP Calculator</h1>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="monthly">Monthly Investment (₹)</Label>
                <Input
                  id="monthly"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="years">Investment Period (Years)</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="return">Expected Return Rate (%)</Label>
                <Input
                  id="return"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleEmail} className="flex-1 bg-primary hover:bg-primary/90">
                  <Mail className="w-4 h-4 mr-2" /> Email
                </Button>
                <Button onClick={handleDownload} className="flex-1 bg-accent hover:bg-accent/90">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
              <h2 className="text-lg font-semibold text-charcoal mb-4">Results</h2>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Total Investment:</span>
                  <span className="font-semibold">₹{totalInvestment.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                  <span>Total Returns:</span>
                  <span className="font-semibold">₹{totalReturns.toLocaleString()}</span>
                </p>
                <p className="flex justify-between text-lg font-semibold">
                  <span>Future Value:</span>
                  <span className="text-primary">₹{futureValue.toLocaleString()}</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Charts Section */}
          <Card className="p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-charcoal mb-6">Wealth Growth Projection</h2>
            <div className="h-[300px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000)}K`} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="value" stroke="#245e4f" fill="#7ac9a7" />
                  <Area type="monotone" dataKey="invested" stroke="#e9c46a" fill="#e9c46a" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <h2 className="text-xl font-semibold text-charcoal mb-6">Investment Breakdown</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* SEO Content Section */}
        <Card className="mt-8 p-6 bg-white shadow-lg">
          <h2 className="text-2xl font-semibold text-charcoal mb-4">Understanding SIP Calculator</h2>
          <div className="prose max-w-none text-charcoal space-y-4">
            <p>
              A Systematic Investment Plan (SIP) calculator is an essential tool for investors planning their financial future. 
              It helps you understand how your regular investments can grow over time through the power of compound interest.
            </p>
            <h3 className="text-xl font-semibold mt-6">How to Use the SIP Calculator</h3>
            <p>
              1. Enter your planned monthly investment amount<br/>
              2. Specify the investment period in years<br/>
              3. Input your expected annual return rate<br/>
              4. The calculator will instantly show your potential returns
            </p>
            <h3 className="text-xl font-semibold mt-6">Benefits of SIP Investment</h3>
            <p>
              - Disciplined investing through regular contributions<br/>
              - Rupee cost averaging to minimize market timing risk<br/>
              - Power of compounding for long-term wealth creation<br/>
              - Flexibility to start with small amounts<br/>
              - Automatic investment process
            </p>
            <h3 className="text-xl font-semibold mt-6">Factors Affecting SIP Returns</h3>
            <p>
              Several factors influence your SIP returns:
              - Investment amount: Higher regular investments lead to larger corpus
              - Investment period: Longer duration allows better compounding
              - Expected returns: Based on fund performance and market conditions
              - Investment frequency: Monthly, quarterly, or annual contributions
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SIPCalculator;
