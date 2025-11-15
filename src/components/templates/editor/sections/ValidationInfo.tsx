import React, { useState } from 'react';
import { Template } from '../../../../types/template';
import { 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  User, 
  AlertCircle,
  ShieldCheck 
} from 'lucide-react';

interface ValidationInfoProps {
  template: Template;
}

export default function ValidationInfo({ template }: ValidationInfoProps) {
  const [showDetails, setShowDetails] = useState(false);

  const status = {
    isActive: true,
    lastValidation: '03/18/2024',
    validator: 'Marie Dubois',
    validatorRole: 'Marketing Manager',
    comments: 'Template validated according to 2024 guidelines',
  };

  return (
    <div className="bg-white">
      {/* Mobile Header */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full p-4 border-b"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className={`w-5 h-5 ${
              status.isActive ? 'text-green-500' : 'text-gray-400'
            }`} />
            <div>
              <span className="font-medium">Status</span>
              <span className={`ml-2 text-sm ${
                status.isActive ? 'text-green-600' : 'text-gray-500'
              }`}>
                {status.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
            showDetails ? 'rotate-90' : ''
          }`} />
        </button>
      </div>

      {/* Main Content */}
      <div className={`${!showDetails && 'sm:block hidden'}`}>
        <div className="p-4 space-y-4">
          {/* Status Badge */}
          <div className="hidden sm:block">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              status.isActive 
                ? 'bg-green-50 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              <CheckCircle className="w-4 h-4 mr-2" />
              {status.isActive ? 'Active template' : 'Inactive template'}
            </div>
          </div>

          {/* Detailed Information */}
          <div className="space-y-3">
            {/* Last Validation */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium">Last validation</div>
                <div className="text-sm text-gray-600 mt-1">
                  {status.lastValidation}
                </div>
              </div>
            </div>

            {/* Validator */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium">{status.validator}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {status.validatorRole}
                </div>
              </div>
            </div>

            {/* Comments */}
            {status.comments && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium">Validation note</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {status.comments}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline for Mobile */}
          <div className="sm:hidden mt-6 border-t pt-4">
            <div className="text-sm text-gray-500">
              Validation history
            </div>
            <div className="mt-2 space-y-3">
              {[
                { date: '03/18/2024', action: 'Validation', user: 'Marie D.' },
                { date: '03/17/2024', action: 'Modification', user: 'Thomas R.' },
                { date: '03/15/2024', action: 'Creation', user: 'Sophie M.' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">{item.date}</div>
                  <div className="flex items-center gap-2">
                    <span>{item.action}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{item.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="sm:hidden p-4 bg-gray-50 border-t">
          <button className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium">
            View full history
          </button>
        </div>
      </div>
    </div>
  );
}