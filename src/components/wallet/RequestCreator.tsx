import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Coins } from 'lucide-react';
import { useWeb3 } from '@/context/Web3Context';
import { BLOCKCHAIN_CONFIG } from '@/config/blockchain';

export const RequestCreator = () => {
  const { web3State } = useWeb3();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentDestination, setPaymentDestination] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validate input
      if (!amount || !description || !paymentDestination) {
        throw new Error('Please fill in all fields.');
      }

      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        throw new Error('Amount must be a positive number.');
      }

      if (!web3State.signer) {
        throw new Error('Please connect your wallet.');
      }

      // TODO: Implement blockchain transaction logic here
      // Example:
      // const transaction = await web3State.signer.sendTransaction({
      //   to: paymentDestination,
      //   value: ethers.utils.parseEther(amount)
      // });
      // await transaction.wait();

      // Display success message
      alert('Request created successfully!');
      setAmount('');
      setDescription('');
      setPaymentDestination('');
    } catch (error: any) {
      // Display error message
      alert(`Failed to create request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[#1A1F2C] text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Create a Request</CardTitle>
        <CardDescription className="text-gray-400">
          Request funds from sponsors to cover your bills.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="paymentDestination">Payment Destination</Label>
          <Input
            id="paymentDestination"
            type="text"
            placeholder="Enter wallet address"
            value={paymentDestination}
            onChange={(e) => setPaymentDestination(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what the funds are for"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button className="bg-[#6544E4] hover:bg-[#5539c6] text-white font-semibold" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
          <ArrowRight className="ml-2" size={16} />
        </Button>
      </CardContent>
    </Card>
  );
};
