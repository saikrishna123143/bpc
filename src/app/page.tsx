"use client";
import React, { useState } from "react";
import { jsPDF } from "jspdf";

interface Payments {
  PineLabs: number;
  PhonePe: number;
  Cash: number;
  UFill: number;
  Rewards: number;
  Bills: number;
  Other: number;
}

const Page: React.FC = () => {
  const [liters, setLiters] = useState<number | "">("");
  const [pricePerLiter, setPricePerLiter] = useState<number | "">("");
  const [payments, setPayments] = useState<Payments>({
    PineLabs: 0,
    PhonePe: 0,
    Cash: 0,
    UFill: 0,
    Rewards: 0,
    Bills: 0,
    Other: 0,
  });
  
  const totalPrice = liters && pricePerLiter ? liters * pricePerLiter : 0;
  const netAmount = totalPrice - Object.values(payments).reduce((a, b) => a + b, 0);

  const handleAmountChange = (key: keyof Payments, value: number) => {
    setPayments((prev) => ({ ...prev, [key]: prev[key] + value }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    
    const dateTime = new Date().toLocaleString();

    doc.text("BPCL Payment Invoice", 20, 10);
    doc.text(`Date & Time: ${dateTime}`, 20, 20);
    doc.text(`Liters: ${liters}`, 20, 30);
    doc.text(`Price per Liter: ₹${pricePerLiter}`, 20, 40);
    doc.text(`Total Price: ₹${totalPrice.toFixed(2)}`, 20, 50);
    
    let yOffset = 60;
    Object.entries(payments).forEach(([key, value]) => {
      doc.text(`${key}: ₹${value.toFixed(2)}`, 20, yOffset);
      yOffset += 10;
    });

    doc.text(`Net Amount: ₹${netAmount.toFixed(2)}`, 20, yOffset + 10);
    doc.save("invoice.pdf");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-md w-full sm:w-3/4 lg:w-1/2">
      <h2 className="text-2xl font-semibold text-center mb-4">BPCL Payment</h2>
      <InputField label="Liters" value={liters} setValue={setLiters} />
      <InputField label="Price per Liter" value={pricePerLiter} setValue={setPricePerLiter} />
      {totalPrice > 0 && <AmountDisplay label="Total Price" amount={totalPrice} />}
      {Object.keys(payments).map((key) => (
        <PaymentSection key={key} label={key} value={payments[key as keyof Payments]} setValue={(value) => handleAmountChange(key as keyof Payments, value)} />
      ))}
      <button onClick={generatePDF} className="w-full bg-blue-500 py-2 rounded mt-4">Download Invoice</button>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  value: number | "";
  setValue: React.Dispatch<React.SetStateAction<number | "">>;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, setValue }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>
    <input type="number" value={value} onChange={(e) => setValue(e.target.value ? parseFloat(e.target.value) : "")} className="w-full p-2 border rounded bg-gray-800 text-white" />
  </div>
);

interface AmountDisplayProps {
  label: string;
  amount: number;
}

const AmountDisplay: React.FC<AmountDisplayProps> = ({ label, amount }) => (
  <div className="mb-4 text-lg">
    <strong>{label}:</strong> ₹{amount.toFixed(2)}
  </div>
);

interface PaymentSectionProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ label, value, setValue }) => {
  const [inputValue, setInputValue] = useState<string>("");
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1">{label}</label>
      <div className="flex gap-2">
        <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full p-2 border rounded bg-gray-800 text-white" />
        <button onClick={() => { setValue(parseFloat(inputValue) || 0); setInputValue(""); }} className="bg-green-500 px-3 py-2 rounded text-white">Add</button>
      </div>
      {value > 0 && <AmountDisplay label={`${label} Total`} amount={value} />}
    </div>
  );
};

export default Page;