import React, { useState, useEffect, createContext, useContext, ReactNode, FC } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { User, UserRole, Job, Bid, ChatMessage, JobStatus } from './types';
import { api } from './services/api';

// --- ICONS ---
const HomeIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const UserIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const HistoryIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
);
const WalletIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/></svg>
);
const BriefcaseIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
const PlusIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);
const ArrowLeftIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const SendIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);
const CameraIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const StarIcon = ({ className = 'w-5 h-5', isFilled = false }: { className?: string, isFilled?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);
const CheckCircleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const LockIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);


// --- AUTH CONTEXT ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<User | null>;
  logout: () => void;
  signup: (userData: Omit<User, 'id' | 'rating' | 'reviews' | 'avatarUrl'>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('uptou-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('uptou-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<User | null> => {
    setLoading(true);
    const loggedInUser = await api.login(email);
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem('uptou-user', JSON.stringify(loggedInUser));
    }
    setLoading(false);
    return loggedInUser;
  };

  const signup = async (userData: Omit<User, 'id' | 'rating' | 'reviews' | 'avatarUrl'>): Promise<User> => {
    setLoading(true);
    const newUser = await api.signup(userData);
    setUser(newUser);
    localStorage.setItem('uptou-user', JSON.stringify(newUser));
    setLoading(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('uptou-user');
  };

  const value = { user, loading, login, logout, signup };

  if (loading) {
    return <Spinner fullScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- UI COMPONENTS ---

const Spinner = ({ fullScreen = false }: { fullScreen?: boolean }) => (
  <div className={`flex justify-center items-center ${fullScreen ? 'h-screen w-screen' : 'h-full w-full'}`}>
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
  </div>
);

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseClasses = 'w-full font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-400',
    secondary: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-sky-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string }>(
  ({ label, id, ...props }, ref) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        id={id}
        ref={ref}
        className="appearance-none bg-gray-100 border-transparent rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-400"
        {...props}
      />
    </div>
  )
);

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }>(
    ({ label, id, ...props }, ref) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <textarea
            id={id}
            ref={ref}
            rows={4}
            className="appearance-none bg-gray-100 border-transparent rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-400"
            {...props}
        />
    </div>
));

interface CardProps {
    children: ReactNode;
    className?: string;
}

const Card: FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => (
  <div className="bg-white min-h-screen font-sans">
    <div className="container mx-auto max-w-md bg-white min-h-screen">
      <main className="pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  </div>
);

interface HeaderProps {
    title: string;
    showBack?: boolean;
}

const Header: FC<HeaderProps> = ({ title, showBack = false }) => {
    const navigate = useNavigate();
    return (
        <header className="bg-white text-gray-800 p-4 sticky top-0 z-10 flex items-center border-b border-gray-200 h-[65px]">
            {showBack && (
                <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon />
                </button>
            )}
            <h1 className="text-xl font-bold capitalize">{title}</h1>
        </header>
    );
};

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return null;

  const dashboardPath = user.role === UserRole.CUSTOMER ? '/customer' : '/worker';
  const navItems = [
    { path: dashboardPath, icon: <HomeIcon />, label: 'Dashboard' },
    { path: '/history', icon: <HistoryIcon />, label: 'History' },
    { path: '/wallet', icon: <WalletIcon />, label: 'Wallet' },
    { path: '/profile', icon: <UserIcon />, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} className={`flex flex-col items-center justify-center w-full text-sm font-medium transition-colors ${isActive ? 'text-sky-600' : 'text-gray-500 hover:text-sky-600'}`}>
              {React.cloneElement(icon, { className: 'w-7 h-7 mb-1' })}
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// --- ROUTING ---
interface ProtectedRouteProps {
  children: ReactNode;
}
const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const AppRouter = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to={user.role === UserRole.CUSTOMER ? '/customer' : '/worker'} /> : <OnboardingScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            
            <Route path="/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/worker" element={<ProtectedRoute><WorkerDashboard /></ProtectedRoute>} />
            <Route path="/post-job" element={<ProtectedRoute><PostJobScreen /></ProtectedRoute>} />
            <Route path="/job/:id" element={<ProtectedRoute><JobDetailScreen /></ProtectedRoute>} />
            <Route path="/job/:id/bid" element={<ProtectedRoute><PlaceBidScreen /></ProtectedRoute>} />
            <Route path="/job/:id/bids" element={<ProtectedRoute><ViewBidsScreen /></ProtectedRoute>} />
            <Route path="/job/:id/pay" element={<ProtectedRoute><PaymentScreen /></ProtectedRoute>} />
            <Route path="/job/:id/chat" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
            <Route path="/job/:id/rate" element={<ProtectedRoute><RatingScreen /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><ChatHistoryScreen /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><WalletScreen /></ProtectedRoute>} />
        </Routes>
    );
}

// --- SCREENS ---

const OnboardingScreen = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 p-8 text-center">
            <BriefcaseIcon className="w-24 h-24 mb-4 text-sky-500" />
            <h1 className="text-5xl font-bold mb-2">UptoU</h1>
            <p className="text-lg text-gray-600 mb-12">Connecting Local Skills Fast</p>
            <div className="w-full max-w-xs space-y-4">
                <Button onClick={() => navigate('/login', { state: { role: UserRole.CUSTOMER } })}>I Need a Worker</Button>
                <Button onClick={() => navigate('/login', { state: { role: UserRole.WORKER } })} variant="secondary">I Am a Worker</Button>
            </div>
        </div>
    );
};

const LoginScreen = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const role = state?.role || 'user';

    useEffect(() => {
        if(state?.role === UserRole.CUSTOMER) setEmail('customer@test.com');
        if(state?.role === UserRole.WORKER) setEmail('worker@test.com');
    }, [state]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const user = await login(email);
        setLoading(false);
        if (user) {
            navigate(user.role === UserRole.CUSTOMER ? '/customer' : '/worker');
        } else {
            setError('Invalid credentials or user does not exist.');
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <Header title={`Login as ${role}`} showBack />
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                <p className="text-gray-600 mb-8">Login to continue as a {role}.</p>

                <div className="bg-sky-50 border border-sky-200 text-sky-800 text-sm rounded-lg p-3 mb-6">
                    <p className="font-bold">Demo Credentials:</p>
                    {role === UserRole.CUSTOMER ? (
                        <p>Email: <span className="font-mono">customer@test.com</span></p>
                    ) : (
                        <p>Email: <span className="font-mono">worker@test.com</span></p>
                    )}
                    <p>Password: (any password)</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input label="Email" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                    <Input label="Password" id="password" type="password" placeholder="••••••••" required />
                    {error && <p className="text-red-500 text-xs italic my-4">{error}</p>}
                    <div className="space-y-4 mt-8">
                        <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
                        <Button variant="secondary" onClick={() => navigate('/signup', { state })}>Create an Account</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SignupScreen = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    
    const role: UserRole = state?.role || UserRole.CUSTOMER;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!agreed) {
            alert("You must agree to the Terms & Conditions.");
            return;
        }
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const userData = {
            email: formData.get('email') as string,
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            role: role,
            ...(role === UserRole.CUSTOMER && { address: formData.get('address') as string }),
            ...(role === UserRole.WORKER && { 
                skill: formData.get('skill') as string,
                experience: parseInt(formData.get('experience') as string, 10),
             }),
        };
        await signup(userData as Omit<User, 'id' | 'rating' | 'reviews' | 'avatarUrl'>);
        setLoading(false);
        navigate(role === UserRole.CUSTOMER ? '/customer' : '/worker');
    };

    return (
        <Layout>
            <Header title="Create Account" showBack />
            <div className="p-6">
                <form onSubmit={handleSubmit}>
                    <p className="text-gray-600 mb-6">Signing up as a {role}.</p>
                    <Input label="Full Name" id="name" name="name" type="text" placeholder="John Doe" required />
                    <Input label="Email Address" id="email" name="email" type="email" placeholder="you@example.com" required />
                    <Input label="Password" id="password" name="password" type="password" placeholder="••••••••" required />
                    <Input label="Phone Number" id="phone" name="phone" type="tel" placeholder="555-0101" required />

                    {role === UserRole.CUSTOMER && (
                        <Input label="Address" id="address" name="address" type="text" placeholder="123 Main St, Anytown" required />
                    )}

                    {role === UserRole.WORKER && (
                        <>
                            <Input label="Skill Type" id="skill" name="skill" type="text" placeholder="Electrician, Plumber, etc." required />
                            <Input label="Years of Experience" id="experience" name="experience" type="number" placeholder="5" required />
                            <div className="mb-4">
                                <label htmlFor="id-upload" className="block text-gray-700 text-sm font-bold mb-2">ID Upload (Optional)</label>
                                <input type="file" id="id-upload" name="id-upload" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-sky-700 hover:file:bg-gray-200" />
                            </div>
                        </>
                    )}

                    <div className="flex items-center my-6">
                        <input type="checkbox" id="terms" checked={agreed} onChange={() => setAgreed(!agreed)} className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                            I agree to the <a href="#" className="text-sky-700 font-semibold hover:underline">Terms & Conditions</a>.
                        </label>
                    </div>

                    <Button type="submit" disabled={loading || !agreed}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>
            </div>
        </Layout>
    );
};

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}
const TabButton: FC<TabButtonProps> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors w-full ${isActive ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
    >
        {label}
    </button>
);

interface JobCardProps {
  job: Job;
}

const JobCard: FC<JobCardProps> = ({ job }) => {
    const navigate = useNavigate();
    const showActions = [JobStatus.IN_PROGRESS, JobStatus.AWAITING_PAYMENT, JobStatus.COMPLETED].includes(job.status);
  
    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div onClick={() => !showActions && navigate(`/job/${job.id}`)} className={`flex items-start space-x-4 ${!showActions ? 'cursor-pointer' : ''}`}>
                {job.imageUrl && <img src={job.imageUrl} alt={job.title} className="w-24 h-24 object-cover rounded-lg" />}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                        <span className="text-lg font-bold text-sky-600">${job.price || job.budget}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                    <div className="mt-3 text-xs text-gray-400">
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span> &bull; <span className="font-semibold">{job.status}</span>
                    </div>
                </div>
            </div>
             {showActions && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center space-x-2">
                    <button onClick={() => navigate(`/job/${job.id}`)} className="text-xs text-center font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 flex-1 transition-colors">Details</button>
                    <button onClick={() => navigate(`/job/${job.id}/chat`)} className="text-xs text-center font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 flex-1 transition-colors">Chat History</button>
                    <button onClick={() => alert('Wallet feature coming soon!')} className="text-xs text-center font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 flex-1 transition-colors">Wallet</button>
                </div>
            )}
        </div>
    );
};

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed'>('active');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const tabs: Record<typeof activeTab, { label: string, statuses: JobStatus[]}> = {
        active: { label: 'Active', statuses: [JobStatus.IN_PROGRESS, JobStatus.AWAITING_PAYMENT] },
        pending: { label: 'Pending Bids', statuses: [JobStatus.OPEN] },
        completed: { label: 'History', statuses: [JobStatus.COMPLETED, JobStatus.CANCELLED] },
    };

    useEffect(() => {
        const fetchJobs = async () => {
            if (user) {
                setLoading(true);
                const jobStatuses = tabs[activeTab].statuses;
                const fetchedJobs = await api.getJobsByStatus(jobStatuses, user.role, user.id);
                setJobs(fetchedJobs);
                setLoading(false);
            }
        };
        fetchJobs();
    }, [activeTab, user]);

    return (
        <Layout>
            <Header title="My Jobs" />
            <div className="p-4">
                <div className="flex justify-around items-center mb-6 bg-gray-100 p-1 rounded-full space-x-1">
                    {Object.entries(tabs).map(([key, { label }]) => (
                        <TabButton key={key} label={label} isActive={activeTab === key} onClick={() => setActiveTab(key as typeof activeTab)} />
                    ))}
                </div>

                {loading ? <Spinner /> : (
                    jobs.length > 0 ? jobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    )) : <p className="text-center text-gray-500 mt-8">No jobs found in this category.</p>
                )}

            </div>
             <div className="fixed bottom-24 right-5">
                <button onClick={() => navigate('/post-job')} className="bg-sky-500 text-white rounded-full p-4 shadow-lg hover:bg-sky-600 transition-transform transform active:scale-90">
                    <PlusIcon className="w-8 h-8"/>
                </button>
            </div>
        </Layout>
    );
};

const WorkerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'available' | 'bids' | 'progress'>('available');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const tabs: Record<typeof activeTab, { label: string, statuses: JobStatus[]}> = {
        available: { label: 'Available', statuses: [JobStatus.OPEN] },
        bids: { label: 'My Bids', statuses: [JobStatus.OPEN, JobStatus.AWAITING_PAYMENT] },
        progress: { label: 'My Jobs', statuses: [JobStatus.IN_PROGRESS, JobStatus.COMPLETED] },
    };

    useEffect(() => {
        const fetchJobs = async () => {
            if (user) {
                setLoading(true);
                const jobStatuses = tabs[activeTab].statuses;
                const fetchedJobs = await api.getJobsByStatus(jobStatuses, user.role, user.id);
                setJobs(fetchedJobs);
                setLoading(false);
            }
        };
        fetchJobs();
    }, [activeTab, user]);

    return (
        <Layout>
            <Header title="Worker Dashboard" />
            <div className="p-4">
                <div className="flex justify-around items-center mb-6 bg-gray-100 p-1 rounded-full space-x-1">
                     {Object.entries(tabs).map(([key, { label }]) => (
                        <TabButton key={key} label={label} isActive={activeTab === key} onClick={() => setActiveTab(key as typeof activeTab)} />
                    ))}
                </div>

                {loading ? <Spinner /> : (
                    jobs.length > 0 ? jobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    )) : <p className="text-center text-gray-500 mt-8">No jobs found in this category.</p>
                )}
            </div>
        </Layout>
    );
};

const PostJobScreen = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!user) return;
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const jobData = {
            customerId: user.id,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            budget: parseFloat(formData.get('budget') as string),
            location: formData.get('location') as string,
        };
        await api.postJob(jobData);
        setLoading(false);
        navigate('/customer');
    };
    
    return (
        <Layout>
            <Header title="Post a New Job" showBack />
            <div className="p-6">
                <form onSubmit={handleSubmit}>
                    <Input label="Job Title" id="title" name="title" placeholder="e.g., Fix leaky kitchen faucet" required />
                    <Textarea label="Description" id="description" name="description" placeholder="Describe the issue in detail." required />
                    <Input label="Budget ($)" id="budget" name="budget" type="number" placeholder="150" required />
                    <Input label="Location" id="location" name="location" placeholder="Your city or neighborhood" required />
                    <div className="mb-6">
                        <label htmlFor="image-upload" className="block text-gray-700 text-sm font-bold mb-2">Upload Photo (Optional)</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <CameraIcon className="w-8 h-8 mb-2 text-gray-500"/>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                </div>
                                <input id="image-upload" type="file" className="hidden" />
                            </label>
                        </div> 
                    </div>
                    <Button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</Button>
                </form>
            </div>
        </Layout>
    );
};

const JobDetailScreen = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [customer, setCustomer] = useState<User | null>(null);
    const [worker, setWorker] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCancelModalOpen, setCancelModalOpen] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!id) return;
            setLoading(true);
            const fetchedJob = await api.getJobById(id);
            setJob(fetchedJob);
            if (fetchedJob) {
                const fetchedCustomer = await api.getUserById(fetchedJob.customerId);
                setCustomer(fetchedCustomer);
                if (fetchedJob.workerId) {
                    const fetchedWorker = await api.getUserById(fetchedJob.workerId);
                    setWorker(fetchedWorker);
                }
            }
            setLoading(false);
        };
        fetchJobDetails();
    }, [id]);
    
    const handleCancelJob = async () => {
        if (!id) return;
        await api.updateJobStatus(id, JobStatus.CANCELLED);
        setCancelModalOpen(false);
        navigate(-1);
    };

    if (loading) return <Layout><Spinner /></Layout>;
    if (!job || !customer) return <Layout><p>Job not found.</p></Layout>;

    const isCustomer = user?.id === job.customerId;
    const isWorker = user?.id === job.workerId;
    const canBid = user?.role === UserRole.WORKER && job.status === JobStatus.OPEN;
    const canViewBids = isCustomer && job.status === JobStatus.OPEN;
    const canPay = isCustomer && job.status === JobStatus.AWAITING_PAYMENT;
    const isAwaitingPayment = isWorker && job.status === JobStatus.AWAITING_PAYMENT;
    const canChat = (isCustomer || isWorker) && job.status === JobStatus.IN_PROGRESS;
    const canComplete = (isCustomer || isWorker) && job.status === JobStatus.IN_PROGRESS;
    const canRate = (isCustomer || isWorker) && job.status === JobStatus.COMPLETED;

    return (
        <Layout>
            <Header title="Job Details" showBack />
            <div className="p-6">
                {job.imageUrl && <img src={job.imageUrl} alt={job.title} className="w-full h-48 object-cover rounded-lg mb-4" />}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{job.title}</h2>
                    <span className="text-2xl font-bold text-sky-600">${job.price || job.budget}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{job.location}</p>
                <p className="text-gray-700 mb-6">{job.description}</p>
                
                <Card className="mb-6">
                    <h3 className="font-bold mb-2 text-gray-800">Job Poster</h3>
                    <div className="flex items-center space-x-3">
                         <img src={customer.avatarUrl} alt={customer.name} className="w-10 h-10 rounded-full" />
                         <div>
                            <p className="font-semibold text-gray-900">{customer.name}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <StarIcon className="w-4 h-4 text-yellow-400 mr-1" isFilled/>
                                {customer.rating} ({customer.reviews} reviews)
                            </div>
                         </div>
                    </div>
                </Card>

                {worker && (
                     <Card className="mb-6">
                        <h3 className="font-bold mb-2 text-gray-800">Assigned Worker</h3>
                        <div className="flex items-center space-x-3">
                            <img src={worker.avatarUrl} alt={worker.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-gray-900">{worker.name}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" isFilled/>
                                    {worker.rating} ({worker.reviews} reviews)
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                <div className="space-y-3">
                    {canBid && <Button onClick={() => navigate(`/job/${job.id}/bid`)}>Bid Now</Button>}
                    {canViewBids && <Button onClick={() => navigate(`/job/${job.id}/bids`)}>View Bids</Button>}
                    {canPay && <Button onClick={() => navigate(`/job/${job.id}/pay`)}>Proceed to Payment</Button>}
                    {isAwaitingPayment && (
                        <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                            Waiting for customer to complete payment.
                        </div>
                    )}
                    {canChat && <Button onClick={() => navigate(`/job/${job.id}/chat`)}>Open Chat</Button>}
                    {canComplete && <Button variant="secondary" onClick={() => api.updateJobStatus(job.id, JobStatus.COMPLETED).then(() => setJob({...job, status: JobStatus.COMPLETED}))}>Mark as Complete</Button>}
                    {canRate && <Button onClick={() => navigate(`/job/${job.id}/rate`)}>Rate {isCustomer ? 'Worker' : 'Customer'}</Button>}
                    {job.status === JobStatus.IN_PROGRESS && <Button variant="danger" onClick={() => setCancelModalOpen(true)}>Cancel Job</Button>}
                </div>
            </div>
            <Modal isOpen={isCancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Cancel Job">
                <p className="mb-4">You can cancel up to 1 hour before the job start time (for demo purposes, you can cancel anytime).</p>
                <p className="mb-6">Are you sure you want to cancel this job?</p>
                <div className="flex space-x-3">
                    <Button variant="secondary" onClick={() => setCancelModalOpen(false)}>No, Keep It</Button>
                    <Button variant="danger" onClick={handleCancelJob}>Yes, Cancel</Button>
                </div>
            </Modal>
        </Layout>
    );
};

interface BidCardProps {
  bid: Bid;
  onAccept: (bidId: string) => void;
}

const BidCard: FC<BidCardProps> = ({ bid, onAccept }) => {
    const [worker, setWorker] = useState<User | null>(null);

    useEffect(() => {
        api.getUserById(bid.workerId).then(setWorker);
    }, [bid.workerId]);

    if (!worker) return <div className="p-4"><Spinner /></div>;

    return (
        <Card className="mb-4">
            <div className="flex items-start space-x-4">
                <img src={worker.avatarUrl} alt={worker.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-gray-800">{worker.name}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                                <StarIcon className="w-4 h-4 text-yellow-400 mr-1" isFilled/>
                                {worker.rating} ({worker.reviews} reviews)
                            </div>
                        </div>
                        <span className="text-xl font-bold text-sky-600">${bid.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 my-2">Est. Time: {bid.estimatedTime}</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{bid.message}</p>
                    <Button onClick={() => onAccept(bid.id)} className="mt-4">Accept Bid</Button>
                </div>
            </div>
        </Card>
    );
};

const ViewBidsScreen = () => {
    const { id: jobId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (jobId) {
            api.getBidsForJob(jobId).then(fetchedBids => {
                setBids(fetchedBids);
                setLoading(false);
            });
        }
    }, [jobId]);

    const handleAcceptBid = async (bidId: string) => {
        const updatedJob = await api.acceptBid(bidId);
        if(updatedJob) {
            navigate(`/job/${updatedJob.id}/pay`);
        }
    };

    return (
        <Layout>
            <Header title="Bids for Your Job" showBack />
            <div className="p-4">
                {loading ? <Spinner /> : (
                    bids.length > 0 
                    ? bids.map(bid => <BidCard key={bid.id} bid={bid} onAccept={handleAcceptBid} />)
                    : <p className="text-center text-gray-500 mt-8">No bids yet. Check back soon!</p>
                )}
            </div>
        </Layout>
    );
};

const PlaceBidScreen = () => {
    const { id: jobId } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!user || !jobId) return;

        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const bidData = {
            jobId,
            workerId: user.id,
            price: parseFloat(formData.get('price') as string),
            message: formData.get('message') as string,
            estimatedTime: formData.get('estimatedTime') as string,
        };
        await api.postBid(bidData);
        setLoading(false);
        navigate(`/job/${jobId}`);
    };

    return (
        <Layout>
            <Header title="Place Your Bid" showBack />
            <div className="p-6">
                <form onSubmit={handleSubmit}>
                    <Input label="Your Price ($)" id="price" name="price" type="number" placeholder="120" required />
                    <Input label="Estimated Time" id="estimatedTime" name="estimatedTime" placeholder="e.g., 2-3 hours" required />
                    <Textarea label="Message to Customer" id="message" name="message" placeholder="Include a brief message about your experience and availability." required />
                    <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Bid'}</Button>
                </form>
            </div>
        </Layout>
    );
};

const PaymentScreen = () => {
    const { id: jobId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        if(jobId) {
            api.getJobById(jobId).then(fetchedJob => {
                setJob(fetchedJob);
                setLoading(false);
            });
        }
    }, [jobId]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!jobId) return;
        setPaying(true);
        await api.processPayment(jobId);
        setPaying(false);
        navigate(`/job/${jobId}`);
    };

    if (loading) return <Layout><Spinner /></Layout>;
    if (!job) return <Layout><p>Job not found</p></Layout>;

    const platformFee = (job.price || 0) * 0.10; // 10% platform fee
    const total = (job.price || 0) + platformFee;

    return (
        <Layout>
            <Header title="Secure Payment" showBack />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">Confirm and Pay</h2>
                <p className="text-gray-600 mb-6">Your payment will be held securely by UptoU and only released to the worker after the job is completed.</p>
                
                <Card className="mb-6">
                    <h3 className="font-bold text-lg mb-4">Summary</h3>
                    <div className="space-y-2 text-gray-700">
                        <p className="flex justify-between"><span>{job.title}</span> <span className="font-semibold">${job.price?.toFixed(2)}</span></p>
                        <p className="flex justify-between text-sm text-gray-500"><span>Platform Fee (10%)</span> <span className="font-semibold">${platformFee.toFixed(2)}</span></p>
                        <hr className="my-2"/>
                        <p className="flex justify-between font-bold text-lg"><span>Total</span> <span>${total.toFixed(2)}</span></p>
                    </div>
                </Card>

                <form onSubmit={handlePayment}>
                    <h3 className="font-bold text-lg mb-4">Payment Details</h3>
                    <Input label="Card Number" id="card-number" placeholder="•••• •••• •••• ••••" />
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <Input label="Expiry Date" id="expiry" placeholder="MM / YY" />
                        </div>
                        <div className="w-1/2">
                            <Input label="CVC" id="cvc" placeholder="•••" />
                        </div>
                    </div>
                    <Button type="submit" disabled={paying}>
                        <div className="flex items-center justify-center">
                            <LockIcon className="w-5 h-5 mr-2" />
                            {paying ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </div>
                    </Button>
                </form>
            </div>
        </Layout>
    );
};


const ChatScreen = () => {
    const { id: jobId } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(jobId) {
            api.getMessages(jobId).then(setMessages);
        }
        // Mock real-time polling
        const interval = setInterval(() => {
            if(jobId) api.getMessages(jobId).then(setMessages);
        }, 5000);
        return () => clearInterval(interval);
    }, [jobId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !jobId) return;
        const messageData = { jobId, senderId: user.id, text: newMessage };
        const sentMessage = await api.postMessage(messageData);
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
    };
    
    const handleSendProof = async () => {
        if (!user || !jobId) return;
        const proofData = { jobId, senderId: user.id, imageUrl: `https://picsum.photos/seed/proof${Date.now()}/400/300`, isProof: true };
        const sentProof = await api.postMessage(proofData);
        setMessages(prev => [...prev, sentProof]);
    };

    return (
        <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
            <Header title="Chat" showBack />
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-xl p-3 max-w-xs ${msg.senderId === user?.id ? 'bg-sky-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                            {msg.text && <p>{msg.text}</p>}
                            {msg.imageUrl && (
                                <div>
                                    {msg.isProof && <p className="font-bold mb-2">Completion Proof:</p>}
                                    <img src={msg.imageUrl} alt="Uploaded content" className="rounded-lg" />
                                </div>
                            )}
                            <p className="text-xs mt-1 opacity-70 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-2">
                     <button onClick={handleSendProof} className="p-2 text-gray-500 hover:text-sky-600">
                        <CameraIcon />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 border-transparent rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <button onClick={handleSendMessage} className="bg-sky-500 text-white rounded-full p-3 hover:bg-sky-600">
                        <SendIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

const RatingScreen = () => {
    const { id: jobId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ rating, review, jobId });
        // Here you would call an API to submit the rating
        setSubmitted(true);
        setTimeout(() => navigate(-1), 2000);
    };
    
    if (submitted) {
        return (
            <Layout>
                 <Header title="Thank You!" showBack />
                 <div className="p-6 text-center flex flex-col items-center justify-center h-96">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4"/>
                    <h2 className="text-2xl font-bold">Rating Submitted</h2>
                    <p className="text-gray-600">Thank you for your feedback!</p>
                 </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Header title="Rate Your Experience" showBack />
            <div className="p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <p className="text-center font-bold mb-3 text-lg">How would you rate this job?</p>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} type="button" onClick={() => setRating(star)}>
                                    <StarIcon className="w-10 h-10 text-yellow-400 cursor-pointer" isFilled={star <= rating} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <Textarea label="Leave a review (optional)" id="review" value={review} onChange={e => setReview(e.target.value)} placeholder="Share your experience..." />
                    <Button type="submit" disabled={rating === 0}>Submit Rating</Button>
                </form>
            </div>
        </Layout>
    );
};


const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <Layout>
            <Header title="My Profile" />
            <div className="p-6">
                <div className="flex flex-col items-center mb-8">
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mb-4 ring-4 ring-sky-100" />
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-gray-500 capitalize">{user.role}</p>
                    <div className="flex items-center text-gray-600 mt-2">
                        <StarIcon className="w-5 h-5 text-yellow-400 mr-1" isFilled/>
                        <span className="font-bold">{user.rating.toFixed(1)}</span>
                        <span className="ml-1">({user.reviews} reviews)</span>
                    </div>
                </div>

                <Card>
                    <h3 className="font-bold text-lg mb-4">Details</h3>
                    <div className="space-y-3 text-gray-700">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        {user.role === UserRole.CUSTOMER && <p><strong>Address:</strong> {user.address}</p>}
                        {user.role === UserRole.WORKER && (
                            <>
                                <p><strong>Skill:</strong> {user.skill}</p>
                                <p><strong>Experience:</strong> {user.experience} years</p>
                            </>
                        )}
                    </div>
                </Card>

                <div className="mt-8 space-y-3">
                    <Button variant="secondary">Edit Profile</Button>
                    <Button variant="danger" onClick={handleLogout}>Logout</Button>
                </div>
            </div>
        </Layout>
    );
};

const ChatHistoryScreen = () => {
    return (
        <Layout>
            <Header title="Chat History" />
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold">Chat History</h2>
                <p className="text-gray-500 mt-2">All your past conversations will appear here.</p>
            </div>
        </Layout>
    );
};

const WalletScreen = () => {
    return (
        <Layout>
            <Header title="My Wallet" />
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold">Wallet</h2>
                <p className="text-gray-500 mt-2">Your payment methods and transaction history will be available here soon.</p>
            </div>
        </Layout>
    );
};


// --- MAIN APP ---
const App = () => {
  return (
    <HashRouter>
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    </HashRouter>
  );
};

export default App;
