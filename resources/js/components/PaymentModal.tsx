import { X, QrCode, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '../contexts/ToastContext';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  course: {
    courseId: number;
    courseTitle: string;
    price: number;
  };
  adminQrPath?: string;
}
export default function PaymentModal({ isOpen, onClose, course, adminQrPath }: Props) {
  const { showToast } = useToast();
  const [step, setStep] = useState<'qr' | 'confirming' | 'done'>('qr');
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const handleConfirmPayment = async () => {
    setStep('confirming');
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          courseId: course.courseId,
          amount: course.price,
        }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      const data = await response.json();
      if (!response.ok) {
        if (data.error === 'Already Enrolled In This Course!') {
          showToast('You Are Already Enrolled In This Course!', 'error');
        } else if (data.error === 'Pending Transaction Already Exists!') {
          showToast('You Already Have A Pending Payment For This Course!', 'error');
        } else {
          showToast('Failed To Create Payment!', 'error');
        }
        setStep('qr');
        return;
      }
      setTransactionId(data.transactionId);
      setStep('done');
      showToast('Payment Submitted! Waiting For Admin Confirmation!', 'success');
    } catch (error) {
      showToast('Failed To Create Payment!', 'error');
      setStep('qr');
    }
  };
  const handleClose = () => {
    setStep('qr');
    setTransactionId(null);
    onClose();
    if (step === 'done') {
      router.visit('/dashboard');
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-black dark:text-white">Complete Payment</h2>
          <button onClick={handleClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        <div className="p-6">
          {step === 'qr' && (
            <>
              <div className="text-center mb-6">
                <p className="text-zinc-600 dark:text-zinc-400 mb-2">Scan QR Code To Transfer</p>
                <p className="text-3xl font-bold text-black dark:text-white">${course.price.toFixed(2)}</p>
                <p className="text-sm text-zinc-500 mt-1">For: {course.courseTitle}</p>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 mb-6">
                {adminQrPath ? (
                  <img src={adminQrPath} alt="Admin Bank QR" className="w-full max-h-64 object-contain mx-auto" />
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-zinc-500">
                    <QrCode className="w-16 h-16 mb-4" />
                    <p>Admin QR Not Available!</p>
                    <p className="text-sm">Please Contact Support!</p>
                  </div>
                )}
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> After Transferring, Click The Button Below! Your Enrollment Will Be Activated Once Admin Confirms Payment!
                </p>
              </div>
              <button onClick={handleConfirmPayment} className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                I Have Transferred The Money!
              </button>
            </>
          )}
          {step === 'confirming' && (
            <div className="py-12 text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-black dark:text-white">Processing...</p>
              <p className="text-zinc-500">Please Wait!</p>
            </div>
          )}
          {step === 'done' && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xl font-bold text-black dark:text-white mb-2">Payment Submitted!</p>
              <p className="text-zinc-500 mb-6">Transaction ID: #{transactionId}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Your Course Will Be Unlocked Once Admin Confirms Your Payment! This Usually Takes A Few Hours!
              </p>
              <button onClick={handleClose} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer">
                Go To Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}