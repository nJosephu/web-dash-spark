
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bitcoin, Globe, Wallet } from "lucide-react";

const Web3Wallet = () => {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Web3 Wallet</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#6544E4]" />
              Your Web3 Wallet
            </CardTitle>
            <CardDescription>
              Connect and manage your decentralized wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-[#F7F5FF] border border-[#E9E2FF] rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Wallet Address</p>
              <p className="font-mono text-xs bg-white p-2 rounded border border-gray-200 break-all">
                Not connected
              </p>
            </div>
            
            <Button className="w-full bg-[#6544E4] hover:bg-[#5335C5]">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tokens">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Tokens</CardTitle>
                <CardDescription>
                  View and manage your cryptocurrency tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bitcoin className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="font-medium">Bitcoin</p>
                        <p className="text-xs text-gray-500">BTC</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">0.00 BTC</p>
                      <p className="text-xs text-gray-500">$0.00 USD</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#627EEA] flex items-center justify-center text-white font-bold text-xs">
                        ETH
                      </div>
                      <div>
                        <p className="font-medium">Ethereum</p>
                        <p className="text-xs text-gray-500">ETH</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">0.00 ETH</p>
                      <p className="text-xs text-gray-500">$0.00 USD</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Globe className="mr-2 h-4 w-4" />
                  View All Tokens
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="nfts">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your NFTs</CardTitle>
                <CardDescription>
                  Digital collectibles and assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50">
                  <div className="text-center px-6">
                    <p className="text-sm text-gray-500">
                      Connect your wallet to view your NFT collection
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction History</CardTitle>
                <CardDescription>
                  View your past transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-500">
                    No transactions found. Connect your wallet to view your transaction history.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Web3 Benefits</CardTitle>
            <CardDescription>
              Advantages of using Web3 for bill payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Lower Transaction Fees</h3>
                  <p className="text-sm text-gray-600">Save money with reduced transaction costs compared to traditional payment methods.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Enhanced Security</h3>
                  <p className="text-sm text-gray-600">Blockchain technology provides increased security and transparency for all transactions.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                    <path d="M12 22v-5" />
                    <path d="M9 8V2" />
                    <path d="M15 8V2" />
                    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Global Accessibility</h3>
                  <p className="text-sm text-gray-600">Access financial services from anywhere in the world without traditional banking limitations.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Web3Wallet;
