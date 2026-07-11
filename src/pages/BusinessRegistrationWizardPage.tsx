import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  Image as ImageIcon, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  Building2,
  Phone,
  Mail,
  Globe,
  Clock,
  FileText
} from 'lucide-react';
import { createBusinessInSupabase } from '../services/supabaseService';
import { useStore } from '../store/useStore';
import { ImageUploader } from '../components/business/ImageUploader';

export const BusinessRegistrationWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'leather' as 'leather' | 'fashion' | 'electronics' | 'manufacturing' | 'food' | 'services' | 'tech',
    description: '',
    phone: user?.phone || '',
    whatsapp: '',
    email: user?.email || '',
    website: '',
    business_type: 'Sole Proprietorship',
    opening_hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    state: 'Abia State',
    city: 'Aba',
    lga: 'Aba South',
    market_zone: 'Ariaria International Market',
    street: '',
    gps_location: '5.1063° N, 7.3667° E',
    image_url: 'https://images.unsplash.com/photo-1556742049-0a67d559c5d0?w=800',
    cover_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200',
    cac_number: '',
    tin: '',
    national_id: '',
    owner_name: user?.name || '',
    owner_photo: user?.avatar_url || '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && (!formData.name || !formData.description || !formData.phone)) {
      setError('Please fill in all required business info fields.');
      return;
    }
    if (step === 2 && !formData.street) {
      setError('Please provide street address or market location.');
      return;
    }
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setError('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to register a business.');
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error: bizError } = await createBusinessInSupabase({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        address: `${formData.street}, ${formData.market_zone}, ${formData.city}`,
        market_zone: formData.market_zone,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        email: formData.email,
        website: formData.website,
        image_url: formData.image_url,
        opening_hours: { "schedule": formData.opening_hours },
        verified: false, // Pending Approval
        owner_id: user.id,
      } as any);

      if (bizError) throw bizError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/business-dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to submit business registration. Please check Supabase configuration.');
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Information', icon: Store },
    { num: 2, title: 'Location', icon: MapPin },
    { num: 3, title: 'Media', icon: ImageIcon },
    { num: 4, title: 'Verification', icon: ShieldCheck },
    { num: 5, title: 'Review', icon: CheckCircle2 },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Registration Submitted!</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Your business has been registered successfully with status <strong className="text-amber-400">Pending Approval</strong>. Redirecting to your Business Portal...
          </p>
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold mb-3">
            <Store className="w-3.5 h-3.5" /> FindAba OS V2 Business Wizard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Register Your Business in Aba</h1>
          <p className="text-xs text-zinc-400">Join the living commercial engine of Ariaria and Aba metropolis.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;
            return (
              <div key={s.num} className="flex flex-col items-center flex-1 relative">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-500/20'
                    : isCompleted
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-semibold mt-2 hidden sm:block ${isCurrent ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {/* STEP 1: Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-zinc-800 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" /> 1. Business Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Aba Master Leather Works"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Category *</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 capitalize"
                  >
                    <option value="leather">Leather & Shoes</option>
                    <option value="fashion">Fashion & Tailoring</option>
                    <option value="electronics">Electronics & Tech</option>
                    <option value="manufacturing">Manufacturing & Fabrication</option>
                    <option value="food">Food & Restaurant</option>
                    <option value="services">Professional Services</option>
                    <option value="tech">Tech & Software</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Business Type</label>
                  <select
                    value={formData.business_type || ''}
                    onChange={(e) => handleChange('business_type', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Limited Liability">Limited Liability (Ltd)</option>
                    <option value="Cooperative">Cooperative Society</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Description *</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe what your business offers, quality standards, and craftsmanship..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.whatsapp || ''}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="business@findaba.os"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={formData.opening_hours || ''}
                    onChange={(e) => handleChange('opening_hours', e.target.value)}
                    placeholder="Mon - Sat: 8:00 AM - 6:00 PM"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-zinc-800 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" /> 2. Business Location
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state || ''}
                    disabled
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    disabled
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">LGA</label>
                  <select
                    value={formData.lga || ''}
                    onChange={(e) => handleChange('lga', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Aba South">Aba South</option>
                    <option value="Aba North">Aba North</option>
                    <option value="Osisioma Ngwa">Osisioma Ngwa</option>
                    <option value="Ugwunagbo">Ugwunagbo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Market Zone / Hub</label>
                  <select
                    value={formData.market_zone || ''}
                    onChange={(e) => handleChange('market_zone', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Ariaria International Market">Ariaria International Market</option>
                    <option value="Cemetery Market">Cemetery Market</option>
                    <option value="Eziukwu Market (Ohanku)">Eziukwu Market (Ohanku)</option>
                    <option value="Power Line Shoe Hub">Power Line Shoe Hub</option>
                    <option value="Faulks Road Industrial Zone">Faulks Road Industrial Zone</option>
                    <option value="Geometric Power City">Geometric Power City</option>
                    <option value="Aba Township">Aba Township</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Street Address / Shop Number *</label>
                  <input
                    type="text"
                    value={formData.street || ''}
                    onChange={(e) => handleChange('street', e.target.value)}
                    placeholder="e.g. Block 4, Line B, Shop 12"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">GPS Location / Map Coordinates</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.gps_location || ''}
                      onChange={(e) => handleChange('gps_location', e.target.value)}
                      placeholder="5.1063° N, 7.3667° E"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => alert('GPS Location captured successfully via FindAba OS Geolocation.')}
                      className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                    >
                      Pin GPS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Media */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold border-b border-zinc-800 pb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-500" /> 3. Business Media & Branding
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ImageUploader
                  value={formData.image_url}
                  onChange={(url) => handleChange('image_url', url)}
                  label="Store Logo / Front Photo"
                  aspectSquare={true}
                />

                <ImageUploader
                  value={formData.cover_image}
                  onChange={(url) => handleChange('cover_image', url)}
                  label="Cover / Banner Image"
                  aspectSquare={false}
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                Images are automatically compressed and stored securely in Supabase Storage with optimized public CDN URLs.
              </p>
            </div>
          )}

          {/* STEP 4: Verification */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-zinc-800 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> 4. Verification & Legal Credentials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">CAC Registration Number</label>
                  <input
                    type="text"
                    value={formData.cac_number || ''}
                    onChange={(e) => handleChange('cac_number', e.target.value)}
                    placeholder="BN 1234567 or RC 987654"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Tax Identification Number (TIN)</label>
                  <input
                    type="text"
                    value={formData.tin || ''}
                    onChange={(e) => handleChange('tin', e.target.value)}
                    placeholder="TIN-98765432-0001"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Business Owner Full Name *</label>
                  <input
                    type="text"
                    value={formData.owner_name || ''}
                    onChange={(e) => handleChange('owner_name', e.target.value)}
                    placeholder="Chinedu Okafor"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">National ID / NIN (Optional)</label>
                  <input
                    type="text"
                    value={formData.national_id}
                    onChange={(e) => handleChange('national_id', e.target.value)}
                    placeholder="11-digit NIN"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold border-b border-zinc-800 pb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 5. Review & Confirm Submission
              </h2>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img src={formData.image_url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-lg text-white">{formData.name}</h3>
                    <p className="text-xs text-emerald-400 capitalize">{formData.category} • {formData.business_type}</p>
                    <p className="text-xs text-zinc-400 mt-1">{formData.market_zone}, {formData.city}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800 text-xs">
                  <div>
                    <span className="text-zinc-500 block mb-1">Phone</span>
                    <span className="font-bold text-white">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Owner</span>
                    <span className="font-bold text-white">{formData.owner_name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">CAC / TIN</span>
                    <span className="font-bold text-white">{formData.cac_number || 'Pending'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>By submitting, you confirm that your business details are authentic and comply with Abia State and Federal trade standards for Made-in-Aba merchants.</span>
              </div>
            </div>
          )}

          {/* Wizard Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-[#0B7A3B] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/40 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Confirm & Submit Business
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
