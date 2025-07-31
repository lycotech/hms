# Hospital Management System (HMS) Demo

A comprehensive, modern Hospital Management System built with Next.js 14, TypeScript, and Ant Design. This demo showcases a complete patient workflow from registration to medication dispensing with integrated payment verification.

## 🏥 Overview

This Hospital Management System demonstrates a real-world hospital workflow with **critical business logic** - **No medication dispensing without payment verification**. The system is designed for Nigerian hospitals with local currency (₦), realistic patient data, and compliance requirements.

## ✨ Key Features

### 🔒 **Critical Business Rule: Payment Verification**
- **Pharmacy cannot dispense medications without payment verification**
- Real-time payment status checking across all departments
- Integrated payment workflow from cashier to pharmacy
- Prevents revenue loss through enforced payment policies

### 🏢 **Multi-Department Workflow**

#### 📋 **Reception Department**
- Patient registration (new/existing patients)
- Queue number assignment with priority management
- Patient search with multiple criteria
- Insurance information management
- Emergency contact recording

#### 🩺 **Screening Room**
- Vital signs recording (BP, temperature, weight, height)
- Visual acuity testing
- Pre-consultation documentation
- Patient queue status management

#### 👨‍⚕️ **Doctor Consultation**
- Complete patient medical history display
- Digital prescription writing
- Treatment plan documentation
- Referral management
- Diagnostic test ordering

#### 💰 **Cashier/Billing**
- Multi-service billing (consultation, tests, medications, glasses)
- Multiple payment methods (cash, card, transfer, insurance)
- Real-time payment processing
- Receipt generation
- Revenue tracking and reporting

#### 💊 **Pharmacy**
- **Payment verification before dispensing** (critical feature)
- Prescription queue management
- Medication inventory tracking
- Dispensing history and audit trail
- Patient counseling documentation

#### 👑 **Admin Dashboard**
- Hospital-wide statistics and analytics
- Department performance monitoring
- Revenue reporting by service/payment method
- User management and permissions
- System health monitoring

### 📱 **Technical Features**

#### 🌐 **Offline-First Architecture**
- localStorage for data persistence
- Sync status indicators
- Offline queue management
- Connection status monitoring
- Automatic data synchronization when online

#### 🎨 **Modern UI/UX**
- Responsive design for desktop and tablet use
- Role-based navigation and permissions
- Real-time status updates
- Professional medical interface design
- High contrast for accessibility

#### 🔧 **State Management**
- Zustand for efficient state management
- Persistent storage with automatic sync
- Type-safe state updates
- Optimistic UI updates

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: Ant Design
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Icons**: Lucide React & Ant Design Icons
- **Date Handling**: Day.js

## 📁 Project Structure

```
hospital-hms-demo/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Main app layout
│   │   ├── page.tsx                # Dashboard homepage
│   │   ├── reception/              # Patient registration & queue
│   │   ├── screening/              # Vital signs & pre-consultation
│   │   ├── doctor/                 # Doctor consultation interface
│   │   ├── pharmacy/               # Medication dispensing (with payment verification)
│   │   ├── cashier/                # Payment processing & billing
│   │   └── admin/                  # Admin dashboard & reports
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   ├── layout/                 # Layout components (Sidebar, Header)
│   │   └── modules/                # Feature-specific components
│   ├── lib/
│   │   ├── store/                  # Zustand state management
│   │   ├── types/                  # TypeScript interface definitions
│   │   └── mockData/               # Sample hospital data
│   └── styles/                     # Global styles and themes
├── public/                         # Static assets
└── package.json                    # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-hms-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## 🎯 Demo Scenarios

### 1. **New Patient Registration Flow**
1. Navigate to **Reception** → Register new patient
2. Add patient details, emergency contact, and insurance
3. Automatic queue number assignment
4. Patient appears in hospital-wide queue system

### 2. **Payment Verification Demo** (Critical Feature)
1. Go to **Cashier** → Process payment for patient services
2. Include pharmacy medications in the bill
3. Complete payment processing
4. Navigate to **Pharmacy** → Verify payment status prevents/allows dispensing

### 3. **Multi-Department Patient Journey**
1. **Reception**: Register patient → Assign to queue
2. **Screening**: Record vital signs → Send to doctor
3. **Doctor**: Consultation → Write prescription
4. **Cashier**: Process payment for consultation + medications
5. **Pharmacy**: Verify payment → Dispense medications

### 4. **Offline Capability Demo**
1. Disconnect internet/simulate offline mode
2. Continue registering patients and processing data
3. Observe sync status indicators
4. Reconnect to see automatic data synchronization

### 5. **Role-Based Access**
- Different navigation and permissions for each role
- Reception, Screening, Doctor, Pharmacy, Cashier, Admin
- Department-specific interfaces and workflows

## 📊 Sample Data

The system includes realistic Nigerian hospital data:

### **Patients** (22 sample patients)
- Nigerian names and addresses
- Various medical conditions (diabetes, hypertension, respiratory issues)
- Insurance information (NHIS, private insurance)
- Complete contact details and emergency contacts

### **Services** (20+ services)
- Consultations (General, Specialist, Pediatric, Gynecological)
- Diagnostic tests (CBC, X-Ray, ECG, Ultrasound)
- Optical services (Eye exams, glasses, contact lenses)
- Pharmacy services
- Minor surgical procedures

### **Medications** (25+ medicines)
- Common Nigerian medications with local manufacturer names
- Realistic pricing in Nigerian Naira (₦)
- Proper categorization and prescription requirements
- Stock levels and expiry date tracking

### **Pricing Structure**
- **Normal**: Standard rates for regular patients
- **Private**: Premium rates for private patients  
- **VIP**: Luxury rates for VIP patients
- **Insurance**: Automated insurance claim processing

## 🔐 Business Logic Highlights

### **Payment Verification System**
```typescript
// Critical business rule implementation
const canDispenseMedication = (patientId: string, prescriptionId: string): boolean => {
  const payment = payments.find(p => 
    p.patientId === patientId && 
    p.serviceType === 'pharmacy' && 
    p.status === 'completed'
  );
  return !!payment;
};
```

### **Queue Management**
- Automatic queue number assignment
- Priority queues (Normal, Urgent, Emergency)
- Department-specific queues
- Real-time status updates across all departments

### **Offline-First Design**
- All data stored locally in browser storage
- Sync indicators show connection status
- Offline changes queued for synchronization
- Graceful handling of connection loss/restoration

## 🎨 UI/UX Features

### **Professional Medical Design**
- Clean, intuitive interface suitable for medical professionals
- Color-coded departments for easy navigation
- High contrast text for readability
- Mobile-responsive for tablet use in clinical settings

### **Real-Time Updates**
- Live queue status updates
- Payment verification status changes
- Department workflow indicators
- System health monitoring

### **Accessibility**
- High contrast color schemes
- Clear typography and spacing
- Keyboard navigation support
- Screen reader compatible

## 🚀 Deployment

### **Vercel Deployment** (Recommended)
1. Connect your GitHub repository to Vercel
2. Automatic deployments on push to main branch
3. Environment variables configured in Vercel dashboard

### **Manual Deployment**
```bash
npm run build
npm run export  # For static deployment
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance Features

- **Next.js 14** with App Router for optimal performance
- **Server-side rendering** for fast initial page loads
- **Code splitting** for efficient bundle loading
- **Image optimization** for fast medical imagery
- **Local storage caching** for offline performance

## 🔄 State Management

The application uses Zustand for state management with the following stores:

- **Patient Store**: Patient data, registration, search, queue management
- **Payment Store**: Payment processing, verification, revenue tracking
- **Prescription Store**: Medication management, dispensing workflow
- **User Store**: Authentication, permissions, role management

## 🛡️ Security Features

- **Role-based access control** for different user types
- **Payment verification** prevents unauthorized medication dispensing
- **Audit trails** for all critical operations
- **Data validation** on all form inputs
- **Secure local storage** with encryption options

## 📱 Mobile Responsiveness

The system is optimized for use on:
- **Desktop computers** for administrative tasks
- **Tablets** for point-of-care data entry
- **Mobile phones** for quick lookups and status checks

## 🔧 Customization

### **Adding New Departments**
1. Create new route in `src/app/[department]/`
2. Add department to navigation in `Sidebar.tsx`
3. Implement department-specific components
4. Add to role-based access control

### **Extending Payment Methods**
1. Update payment types in `src/lib/types/index.ts`
2. Add payment method UI in cashier interface
3. Implement payment verification logic
4. Update reporting and analytics

### **Custom Reports**
1. Add report types in admin dashboard
2. Implement data aggregation functions
3. Create export functionality for various formats

## 📞 Support & Documentation

For questions about implementation or customization:

1. Check the inline code documentation
2. Review the TypeScript interfaces for data structures
3. Examine the Zustand stores for business logic
4. Test the demo scenarios to understand workflow

## 🎯 Future Enhancements

Potential improvements for production use:

- **Backend Integration**: Replace mock data with real API
- **Advanced Reporting**: More detailed analytics and insights  
- **Appointment Scheduling**: Calendar-based appointment system
- **Inventory Management**: Complete pharmacy and supplies tracking
- **Laboratory Integration**: Lab test ordering and result management
- **Imaging Integration**: DICOM viewer for radiology
- **Telemedicine**: Video consultation capabilities
- **Mobile Apps**: Native iOS/Android applications
- **Print Integration**: Direct printer support for receipts and reports

---

## 📄 License

This project is a demonstration and is provided as-is for educational and evaluation purposes.

---

**Built with ❤️ for modern healthcare management**
