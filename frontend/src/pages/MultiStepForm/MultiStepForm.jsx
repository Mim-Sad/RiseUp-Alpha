import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MultiStepForm.css';

// Import icons
import sendIcon from '../../assets/icon/launch.svg';
// Import handleFormSubmit function from App
import { handleFormSubmit } from '../../App';

const MultiStepForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Step 2 - Address Information
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Step 3 - Professional Information
    occupation: '',
    company: '',
    experience: '',
    skills: '',
    
    // Step 4 - Additional Information
    interests: '',
    referral: '',
    comments: ''
  });

  // Total number of steps in the form
  const totalSteps = 4;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Move to the next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to the previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Send the form data to App.jsx using the imported handleFormSubmit function
    handleFormSubmit(formData);
    // Navigate back to the home page after submission
    navigate('/');
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Render form steps based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h2>اطلاعات شخصی</h2>
            <div className="form-group">
              <label htmlFor="firstName">نام</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="نام خود را وارد کنید"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">نام خانوادگی</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="نام خانوادگی خود را وارد کنید"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">ایمیل</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ایمیل خود را وارد کنید"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">شماره تماس</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="شماره تماس خود را وارد کنید"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-step">
            <h2>اطلاعات آدرس</h2>
            <div className="form-group">
              <label htmlFor="address">آدرس</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="آدرس خود را وارد کنید"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">شهر</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="شهر خود را وارد کنید"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">استان</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="استان خود را وارد کنید"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">کد پستی</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="کد پستی خود را وارد کنید"
                required
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-step">
            <h2>اطلاعات حرفه‌ای</h2>
            <div className="form-group">
              <label htmlFor="occupation">شغل</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="شغل خود را وارد کنید"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="company">شرکت</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="نام شرکت خود را وارد کنید"
              />
            </div>
            <div className="form-group">
              <label htmlFor="experience">سابقه کاری (سال)</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="سابقه کاری خود را وارد کنید"
              />
            </div>
            <div className="form-group">
              <label htmlFor="skills">مهارت‌ها</label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="مهارت‌های خود را وارد کنید"
                rows="3"
              ></textarea>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-step">
            <h2>اطلاعات تکمیلی</h2>
            <div className="form-group">
              <label htmlFor="interests">علایق</label>
              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="علایق خود را وارد کنید"
                rows="3"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="referral">نحوه آشنایی</label>
              <select
                id="referral"
                name="referral"
                value={formData.referral}
                onChange={handleChange}
              >
                <option value="">انتخاب کنید</option>
                <option value="friend">دوستان</option>
                <option value="social">شبکه‌های اجتماعی</option>
                <option value="search">موتور جستجو</option>
                <option value="other">سایر</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="comments">توضیحات اضافی</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="توضیحات اضافی خود را وارد کنید"
                rows="4"
              ></textarea>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="multistep-form-container">
      <div className="form-header">
        <h1>فرم چند مرحله‌ای</h1>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="steps-indicator">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div 
                key={i} 
                className={`step-circle ${currentStep > i ? 'completed' : ''} ${currentStep === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentStep(i + 1)}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-container">
        {renderStep()}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="prev-button" 
              onClick={prevStep}
            >
              مرحله قبل
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button 
              type="button" 
              className="next-button" 
              onClick={nextStep}
            >
              مرحله بعد
            </button>
          ) : (
            <button 
              type="button" 
              className="submit-button"
              onClick={handleSubmit}
            >
              ارسال
              <img src={sendIcon} alt="Send" width="20" height="20" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;