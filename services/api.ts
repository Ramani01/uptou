import { User, Job, Bid, ChatMessage, UserRole, JobStatus } from '../types';

// --- MOCK DATABASE ---
let users: User[] = [
  { id: 'user1', email: 'customer@test.com', name: 'Alice Johnson', role: UserRole.CUSTOMER, address: '123 Maple St', phone: '555-0101', rating: 4.5, reviews: 10, avatarUrl: 'https://picsum.photos/seed/user1/200' },
  { id: 'user2', email: 'worker@test.com', name: 'Bob Smith', role: UserRole.WORKER, skill: 'Electrician', experience: 10, rating: 4.8, reviews: 25, avatarUrl: 'https://picsum.photos/seed/user2/200' },
  { id: 'user3', email: 'plumber@test.com', name: 'Charlie Brown', role: UserRole.WORKER, skill: 'Plumber', experience: 5, rating: 4.9, reviews: 15, avatarUrl: 'https://picsum.photos/seed/user3/200' },
  { id: 'user4', email: 'carpenter@test.com', name: 'Diana Prince', role: UserRole.WORKER, skill: 'Carpenter', experience: 8, rating: 4.7, reviews: 18, avatarUrl: 'https://picsum.photos/seed/user4/200' },
];

let jobs: Job[] = [
  { id: 'job1', customerId: 'user1', title: 'Fix leaky faucet', description: 'The kitchen sink has been dripping for a week.', budget: 150, location: 'Springfield', status: JobStatus.OPEN, createdAt: new Date(Date.now() - 86400000), imageUrl: 'https://picsum.photos/seed/job1/400/300' },
  { id: 'job4', customerId: 'user1', title: 'Assemble flat-pack wardrobe', description: 'Need help assembling a new IKEA wardrobe. All parts are here.', budget: 100, location: 'Shelbyville', status: JobStatus.OPEN, createdAt: new Date(Date.now() - 43200000), imageUrl: 'https://picsum.photos/seed/job4/400/300' },
  { id: 'job2', customerId: 'user1', title: 'Install new ceiling fan', description: 'Need to replace an old fan in the living room.', budget: 250, location: 'Springfield', status: JobStatus.IN_PROGRESS, workerId: 'user2', price: 240, createdAt: new Date(Date.now() - 172800000) },
  { id: 'job3', customerId: 'user1', title: 'Rewire garage outlet', description: 'The outlet in my garage stopped working.', budget: 200, location: 'Springfield', status: JobStatus.COMPLETED, workerId: 'user3', price: 200, createdAt: new Date(Date.now() - 259200000), imageUrl: 'https://picsum.photos/seed/job3/400/300' },
];

let bids: Bid[] = [
  { id: 'bid1', jobId: 'job1', workerId: 'user2', price: 140, message: "I can fix this quickly for you.", estimatedTime: "2 hours", createdAt: new Date() },
  { id: 'bid2', jobId: 'job1', workerId: 'user3', price: 130, message: "Experienced plumber, available tomorrow.", estimatedTime: "1.5 hours", createdAt: new Date() },
  { id: 'bid5', jobId: 'job1', workerId: 'user4', price: 145, message: "I also have plumbing experience and can take a look.", estimatedTime: "2 hours", createdAt: new Date() },
  { id: 'bid3', jobId: 'job4', workerId: 'user2', price: 95, message: "I can assemble this for you this afternoon. I have my own tools.", estimatedTime: "3 hours", createdAt: new Date() },
  { id: 'bid4', jobId: 'job4', workerId: 'user4', price: 90, message: "Professional carpenter, efficient and clean work guaranteed.", estimatedTime: "2.5 hours", createdAt: new Date() },
];

let messages: ChatMessage[] = [
    {id: 'msg1', jobId: 'job2', senderId: 'user1', text: 'Hi Bob, when can you start?', timestamp: new Date(Date.now() - 3600000) },
    {id: 'msg2', jobId: 'job2', senderId: 'user2', text: 'I can be there tomorrow at 9 AM.', timestamp: new Date(Date.now() - 3540000) },
];

// --- MOCK API FUNCTIONS ---
const simulateDelay = <T,>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 500));

export const api = {
  login: (email: string): Promise<User | null> => {
    const user = users.find(u => u.email === email);
    return simulateDelay(user || null);
  },

  signup: (userData: Omit<User, 'id' | 'rating' | 'reviews' | 'avatarUrl'>): Promise<User> => {
    const newUser: User = {
      ...userData,
      id: `user${users.length + 1}`,
      rating: 0,
      reviews: 0,
      avatarUrl: `https://picsum.photos/seed/user${users.length + 1}/200`
    };
    users.push(newUser);
    return simulateDelay(newUser);
  },

  getUserById: (id: string): Promise<User | null> => {
      const user = users.find(u => u.id === id);
      return simulateDelay(user || null);
  },

  getJobsByStatus: (status: JobStatus[], role: UserRole, userId: string): Promise<Job[]> => {
    let filteredJobs: Job[] = [];
    if(role === UserRole.CUSTOMER) {
        filteredJobs = jobs.filter(j => j.customerId === userId && status.includes(j.status));
    } else { // Worker
        if(status.includes(JobStatus.OPEN)) {
            // Available jobs - open jobs not posted by the worker
            filteredJobs = jobs.filter(j => j.status === JobStatus.OPEN && j.customerId !== userId);
        } else {
            // My Bids / In Progress - jobs worker bid on or is assigned to
            const workerBids = bids.filter(b => b.workerId === userId).map(b => b.jobId);
            filteredJobs = jobs.filter(j => (status.includes(j.status) && (j.workerId === userId || workerBids.includes(j.id))));
        }
    }
    return simulateDelay(filteredJobs.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
  },

  getJobById: (id: string): Promise<Job | null> => {
    const job = jobs.find(j => j.id === id);
    return simulateDelay(job || null);
  },

  postJob: (jobData: Omit<Job, 'id' | 'status' | 'createdAt' | 'price'>): Promise<Job> => {
    const newJob: Job = {
      ...jobData,
      id: `job${jobs.length + 1}`,
      status: JobStatus.OPEN,
      createdAt: new Date(),
    };
    jobs.unshift(newJob);
    return simulateDelay(newJob);
  },

  getBidsForJob: (jobId: string): Promise<Bid[]> => {
    const jobBids = bids.filter(b => b.jobId === jobId);
    return simulateDelay(jobBids);
  },

  postBid: (bidData: Omit<Bid, 'id' | 'createdAt'>): Promise<Bid> => {
    const newBid: Bid = {
      ...bidData,
      id: `bid${bids.length + 1}`,
      createdAt: new Date(),
    };
    bids.push(newBid);
    return simulateDelay(newBid);
  },

  acceptBid: (bidId: string): Promise<Job | null> => {
    const bid = bids.find(b => b.id === bidId);
    if(!bid) return simulateDelay(null);
    const job = jobs.find(j => j.id === bid.jobId);
    if(!job) return simulateDelay(null);
    
    job.workerId = bid.workerId;
    job.price = bid.price;
    job.status = JobStatus.AWAITING_PAYMENT;
    return simulateDelay(job);
  },

  processPayment: (jobId: string): Promise<Job | null> => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        job.status = JobStatus.IN_PROGRESS;
        return simulateDelay(job);
    }
    return simulateDelay(null);
  },

  getMessages: (jobId: string): Promise<ChatMessage[]> => {
      const chatMessages = messages.filter(m => m.jobId === jobId).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
      return simulateDelay(chatMessages);
  },

  postMessage: (messageData: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> => {
      const newMessage: ChatMessage = {
          ...messageData,
          id: `msg${messages.length + 1}`,
          timestamp: new Date(),
      };
      messages.push(newMessage);
      return simulateDelay(newMessage);
  },

  updateJobStatus: (jobId: string, status: JobStatus): Promise<Job | null> => {
      const job = jobs.find(j => j.id === jobId);
      if(job) {
          job.status = status;
          return simulateDelay(job);
      }
      return simulateDelay(null);
  }
};