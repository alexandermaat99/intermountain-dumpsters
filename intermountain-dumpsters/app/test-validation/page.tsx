'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { validateDeliveryAddress, AddressValidationResult } from '@/lib/address-validation';

export default function TestValidationPage() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<AddressValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!address.trim()) return;
    
    setLoading(true);
    try {
      const validationResult = await validateDeliveryAddress(address);
      setResult(validationResult);
    } catch (error) {
      console.error('Validation error:', error);
      setResult({
        isValid: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isWithinServiceArea: false,
        isWithinSurroundingArea: false
      });
    } finally {
      setLoading(false);
    }
  };

  const testAddresses = [
    '123 Main St, Salt Lake City, UT 84101',
    '456 Center St, Provo, UT 84601',
    '789 Oak Ave, Lehi, UT 84043',
    '999 Pine St, New York, NY 10001',
    '1234 S State St, Orem, UT 84097',
    '5678 W 9000 S, Sandy, UT 84070'
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Address Validation Test</h1>
          <p className="text-muted-foreground">
            Test address validation and service area detection
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Address Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address to Test</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter an address to test..."
                  className="flex-1"
                />
                <Button onClick={handleTest} disabled={loading || !address.trim()}>
                  {loading ? 'Testing...' : 'Test'}
                </Button>
              </div>
            </div>

            <div>
              <Label>Quick Test Addresses</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                {testAddresses.map((testAddr, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setAddress(testAddr)}
                    className="justify-start text-left h-auto p-2"
                  >
                    <div className="text-xs">{testAddr}</div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Validation Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                result.isValid 
                  ? result.isWithinServiceArea 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="font-medium mb-2">
                  {result.isValid ? '✅ Valid' : '❌ Invalid'}
                </div>
                <div className="text-sm">{result.message}</div>
                {result.distance && (
                  <div className="text-xs mt-1 opacity-75">
                    Distance: {result.distance.toFixed(1)} miles
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Service Area:</strong> {result.isWithinServiceArea ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Surrounding Area:</strong> {result.isWithinSurroundingArea ? 'Yes' : 'No'}
                </div>
                {result.serviceArea && (
                  <div className="col-span-2">
                    <strong>Closest Service Area:</strong> {result.serviceArea.name}
                  </div>
                )}
              </div>

              {result.debug && (
                <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                  <div className="font-medium mb-2">Debug Information:</div>
                  <div>Method: {result.debug.validationMethod}</div>
                  {result.debug.coordinates && (
                    <div>
                      Coordinates: {result.debug.coordinates.lat.toFixed(4)}, {result.debug.coordinates.lng.toFixed(4)}
                    </div>
                  )}
                  <div>Service Radius: {result.debug.serviceRadius} miles</div>
                  <div>Surrounding Radius: {result.debug.surroundingRadius} miles</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 