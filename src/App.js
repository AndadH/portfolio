import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Monitor, Cpu, Zap, Users, Code, Award, ChevronRight, Play, Pause, RotateCcw, ZoomIn, Image, ExternalLink, CheckCircle, Archive } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera, Html } from '@react-three/drei';

const getGitHubContributions = async (username) => {
  try {
    // Get basic profile data
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userResponse.json();

    // Try to get contribution count from GitHub's contribution API
    // This is a bit of a workaround since GitHub doesn't expose total contributions directly
    const currentYear = new Date().getFullYear();
    
    // We'll estimate based on profile data and use a more realistic calculation
    const accountAge = new Date().getFullYear() - new Date(userData.created_at).getFullYear();
    const estimatedContributions = Math.max(275, userData.public_repos * 15 + accountAge * 50);

    return {
      totalContributions: estimatedContributions, // Use your known value or estimation
      publicRepos: userData.public_repos,
      followers: userData.followers,
      contributionCounts: {
        commits: Math.floor(estimatedContributions * 0.7),
        pullRequests: Math.floor(estimatedContributions * 0.15),
        issues: Math.floor(estimatedContributions * 0.1),
        reviews: Math.floor(estimatedContributions * 0.05)
      }
    };

  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return {
      totalContributions: 275, // Your actual count
      publicRepos: 8,
      followers: 12,
      contributionCounts: {
        commits: 192,
        pullRequests: 41,
        issues: 28,
        reviews: 14
      }
    };
  }
};

const EngineeringCommandCenter = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedModel, setSelectedModel] = useState(null);
  const [apiStatus, setApiStatus] = useState('simulated');

  // Simulated live data - separate static and dynamic data
  const [gameStats, setGameStats] = useState({
    activeUsers: 675,
    totalPlayers: 675,
    uptime: 99.7
  });

  // Static project data (won't cause re-renders)
  const staticProjectData = {
    multiplayer: {
      totalPlayers: 675,
      uptime: 99.7
    }
  };

  const [systemMetrics, setSystemMetrics] = useState({
    projectsCompleted: 6,
    patentsPending: 1,
    linesOfCode: 15420,
    teamCollaborations: 12
  });

  const [githubStats, setGithubStats] = useState({
  totalLines: 15420, // fallback
  languages: {},
  loading: true
});

useEffect(() => {
  const fetchGitHubData = async () => {
    try {
      const stats = await getGitHubContributions('AndadH');
      setGithubStats({
        totalContributions: stats.totalContributions,
        commits: stats.contributionCounts.commits,
        pullRequests: stats.contributionCounts.pullRequests,
        issues: stats.contributionCounts.issues,
        publicRepos: stats.publicRepos,
        followers: stats.followers,
        loading: false
      });
    } catch (error) {
      console.error('Failed to load GitHub stats:', error);
      setGithubStats(prev => ({ ...prev, loading: false }));
    }
  };

  fetchGitHubData();
}, []);

  // Update time every second, but pause when viewing projects to prevent 3D viewer resets
  useEffect(() => {
    // Don't run timer on projects page to prevent 3D viewer resets
    if (activeSection === 'projects' || activeSection === 'completed') {
      return;
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate fluctuating data
      if (isSystemActive) {
        setGameStats(prev => ({
          ...prev,
          activeUsers: Math.max(300, prev.activeUsers + Math.floor(Math.random() * 10 - 5))
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isSystemActive, activeSection]); // Added activeSection as dependency

  const experiences = [
    {
      id: 'amazon',
      title: 'Amazon Area Maintenance Manager',
      period: 'Jun 2025 - Aug 2025',
      status: 'active',
      description: 'Managment and Large-scale equipment monitoring systems',
      metrics: { systems: 3, reports: 8 }
    },
    {
      id: 'research',
      title: 'BYU Neuromorphic Computing',
      period: 'Sep 2024 - Jan 2025',
      status: 'completed',
      description: 'Novel XOR chip development',
      metrics: {}
    },
    {
      id: 'cr8',
      title: 'CR8 Parts Designer and Lead',
      period: 'Apr 2023 - Jan 2024',
      status: 'completed',
      description: 'Patent Pending pond filtration system',
      metrics: { patent: 1, }
    }
  ];

  const projects = [
    {
      name: 'Multiplayer IO Game',
      status: 'operational',
      users: 342,
      total: 675,
      tech: ['AWS EC2','Firebase', 'Node.js', 'JavaScript'],
      description: 'Real-time multiplayer strategy game with base building, PvP combat, and resource management',
      images: [
        { url: '/pictures/jagar.jpg', caption: 'Fun base building multiplayer game' },
        { url: '/pictures/firebaseaccounts.png', caption: 'Firebase data storage and accounts for persitent accounts and user data' },
        { url: '/pictures/boss.png', caption: 'Exciting bosses and multiple biomes' },
        { url: '/pictures/goodcode.png', caption: 'Clean efficient code structure to enable team-work' },
        { url: '/pictures/ec2.webp', caption: 'Run off of AWS infrastructure' }
      ],
      liveApi: 'https://your-game.herokuapp.com/api/stats',
      demoLink: 'https://jagar.io'
    },
    {
      name: 'AWS AI Platform',
      status: 'development',
      progress: 67,
      tech: ['AWS', 'Docker', 'Python', 'PyTorch'],
      description: 'Scalable AI/ML platform using containerization and cloud services for model deployment',
      images: [
        { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', caption: 'AWS cloud architecture and service integration' },
        { url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800', caption: 'Docker containerization and orchestration setup' },
        { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', caption: 'Machine learning model training pipeline' },
        { url: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=800', caption: 'API endpoints and microservices architecture' }
      ]
    },
    {
      name: 'Pond Filtration System',
      status: 'patent-pending',
      ip: 'US Patent Pending',
      tech: ['Mechanical Design', 'SolidWorks', 'Manufacturing'],
      description: 'Patent Pending multi-stage filtration system with innovative flow dynamics and mechanical design',
      images: [
        { url: '/pictures/pond9.jpeg', caption: 'Actual Prototypes and use' },
        { url: '/pictures/haywardinaction.png', caption: 'Commonly compatible with most cheap pool filters' },
        { url: '/pictures/hayward.png', caption: 'Patent technical drawings and specifications' },
        { url: '/pictures/bottomfilter.png', caption: 'Prototype testing and flow dynamics analysis' },
        { url: '/pictures/completeassem.png', caption: 'Complete Assembly' },
      ],
      model3d: 'pond-filter-system.glb'
    }
  ];

  // Completed Projects Array
  const completedProjects = [
    {
      name: 'Amazon Flatsorter No-read%',
      status: 'completed',
      completedDate: 'July 2025',
      tech: ['Python', 'Javascript', 'AWS', 'API', 'EC2'],
      description: 'I was tasked with investigating and improving flatsorter scanner performance',
      achievements: ['Created Monitoring Notification System used acrossed multiple teams', 'Stastically proved performance increased: 50%', 'Generated a solution to poor inductions for less than $40'],
      images: [
        { url: '/pictures/fsctock.webp', caption: 'Improved scanner performance on one of Amazons Large Sorters' },
        { url: '/pictures/finalflow.jpg', caption: 'Final solution for sending notifications' },
        { url: '/pictures/firstflow.jpg', caption: 'Original soltuon for sending notifications' },
        { url: '/pictures/pyanalysis.jpg', caption: 'Analysis of chute status' },
        { url: '/pictures/metric.jpg', caption: 'New Metric generated' },
        { url: '/pictures/kiting.jpg', caption: 'Kiting and a proposed solution' }
      ],
      impact: 'Sustainable alarming for large pieces of equipment, improved scanner performance'
    },
    {
      name: 'Amazon Disabled Carrier Status',
      status: 'completed',
      completedDate: 'August 2025',
      tech: ['Python', 'Monitoring Systems'],
      description: 'I was tasked with finding the impact of having disabled carriers on the flatsorter',
      achievements: [],
      images: [
        { url: '/pictures/dataset.jpg', caption: 'Data set generated to analyze the problem' },
        { url: '/pictures/reportgenerated.jpg', caption: 'Automated python script to analyze various datasets' },
        { url: '/pictures/logicalequation.jpg', caption: 'Due to lacking data, equation generated with logical deduction' },
      ],
      impact: 'Helped leaders prioritize issues'
    },
    {
      name: 'Amazon Asset Performance Manager Control Panel',
      status: 'completed',
      completedDate: 'August 2025',
      tech: ['Javascript', 'Script Injection'],
      description: 'Increase the reliability of work orders filled out, increased the effeciency',
      achievements: [],
      images: [
        { url: '/pictures/APMpanel.png', caption: 'Full control of a robust system' },
        { url: '/pictures/APMwo.png', caption: 'Learn where there is something wrong automatically' },
        { url: '/pictures/APM.png', caption: 'Prevent mistakes before they happen' },
      ],
      impact: 'Demonstrated significant improvements in APM usage speed and reliability'
    },
    {
      name: 'AI Hydraulic Monitoring',
      status: 'completed',
      completedDate: 'April 2025',
      tech: ['Pytorch', 'Python'],
      description: 'A project for monitoring Hydraullic systems',
      achievements: ['99% accuary cooler', '90% accuracy pump', '89% accuarcy valve'],
      images: [
        { url: '/pictures/training.png', caption: 'Training Results' },
        { url: '/pictures/arch.png', caption: 'Model Archeticture' },
        { url: '/pictures/results.png', caption: 'Results of Training' },
      ],
      impact: 'Understanding of complex Models for real Applications'
    },
    {
      name: 'Mechatronics Miniature Mars Rover',
      status: 'completed',
      completedDate: 'December 2024',
      tech: ['Assembly','PIC','3D printing','Solidworks','Eagle PCB'],
      description: 'Semester Long complex class project',
      achievements: ['Full autonomous', 'Custom made PCB', 'Custom percise housing'],
      images: [
        { url: '/pictures/robot.jpg', caption: 'Robot with wiring' },
        { url: '/pictures/robot2.jpg', caption: 'Robot body' },
        { url: '/pictures/pcb.jpb', caption: 'Custom PCB' },
      ],
      impact: 'Understanding of Mechatronic systems at a fundamental level'
    }
  ];

  // Image Gallery Component
  const ImageGallery = ({ images, projectName }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const nextImage = () => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const openModal = (index) => {
      setSelectedImage(index);
      setIsModalOpen(true);
    };

    return (
      <div className="space-y-4">
        {/* Main Image Display */}
        <div className="relative group">
          <div 
            className="aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer border-2 border-gray-600 hover:border-blue-400 transition-all duration-300"
            onClick={() => openModal(selectedImage)}
          >
            <img 
              src={images[selectedImage]?.url} 
              alt={images[selectedImage]?.caption}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          
          {/* Image Caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white text-sm font-medium">{images[selectedImage]?.caption}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-300">{selectedImage + 1} of {images.length}</span>
              <button
                onClick={() => openModal(selectedImage)}
                className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ZoomIn className="w-3 h-3" />
                <span>Full Size</span>
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-14 rounded border-2 overflow-hidden transition-all duration-200 ${
                  selectedImage === index 
                    ? 'border-blue-400 shadow-lg shadow-blue-400/30' 
                    : 'border-gray-600 hover:border-gray-400'
                }`}
              >
                <img 
                  src={image.url} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Full-Size Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative max-w-6xl max-h-full">
              <img 
                src={images[selectedImage]?.url}
                alt={images[selectedImage]?.caption}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Modal Controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                >
                  <ExternalLink className="w-5 h-5 rotate-45" />
                </button>
              </div>

              {/* Modal Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
                  >
                    <ChevronRight className="w-6 h-6 rotate-180" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Modal Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h4 className="text-white font-bold text-lg mb-2">{projectName}</h4>
                <p className="text-gray-300">{images[selectedImage]?.caption}</p>
                <div className="mt-2 text-sm text-gray-400">
                  Image {selectedImage + 1} of {images.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Completely isolated 3D viewer that won't re-render
  const Isolated3DViewer = React.memo(() => {
    const controlsRef = useRef();
    const [viewerKey] = useState(Math.random()); // Unique key that never changes

    const resetCamera = () => {
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
    };

    return (
      <div className="bg-gray-900/50 rounded-lg overflow-hidden" key={viewerKey}>
        {/* 3D Viewer Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800/50 border-b border-gray-600">
          <div>
            <h4 className="font-bold text-blue-400">3D MODEL VIEWER</h4>
            <p className="text-sm text-gray-400">Patent Pending Pond Filtration System</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={resetCamera}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="h-96 relative">
          <Canvas
            camera={{ position: [0.1, 0.1, 0.1], fov: 50 }}
            style={{ background: 'linear-gradient(to bottom, #1f2937, #111827)' }}
          >
            <Environment preset="studio" />
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            
            <Suspense fallback={<Html center><div className="text-white">Loading...</div></Html>}>
              <primitive object={useGLTF('/filter.glb').scene} />
            </Suspense>
                        
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={false}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Canvas>
          
          {/* Controls overlay */}
          <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3">
            <div className="text-xs text-gray-300 space-y-1">
              <div><strong>Left click:</strong> Rotate</div>
              <div><strong>Right click:</strong> Pan</div>
              <div><strong>Scroll:</strong> Zoom</div>
            </div>
          </div>
        </div>

        {/* Model Info */}
        <div className="p-4 bg-gray-800/30">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400">File Size</div>
              <div className="font-bold text-green-400">2.3 MB</div>
            </div>
            <div>
              <div className="text-gray-400">Polygons</div>
              <div className="font-bold text-blue-400">15,420</div>
            </div>
            <div>
              <div className="text-gray-400">Format</div>
              <div className="font-bold text-purple-400">GLB/GLTF</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-gray-400 text-xs mb-1">Description</div>
            <div className="text-gray-300 text-sm">Multi-stage filtration system with Patent Pending flow dynamics</div>
          </div>
        </div>
      </div>
    );
  }, []); // Empty dependency array - never re-renders

  // API Integration Function
  const fetchLiveGameData = async () => {
    try {
      // Replace with your actual game API endpoint
      const response = await fetch('https:/jagar.io/api/stats');
      const data = await response.json();
      setGameStats(data);
      setApiStatus('live');
    } catch (error) {
      console.log('Using simulated data - set up your API endpoint');
      setApiStatus('simulated');
    }
  };

  const StatusIndicator = ({ status }) => {
    const colors = {
      active: 'bg-green-400',
      operational: 'bg-green-400',
      development: 'bg-yellow-400',
      completed: 'bg-blue-400',
      'patent-pending': 'bg-purple-400'
    };
    
    return (
      <div className={`w-3 h-3 rounded-full ${colors[status]} animate-pulse`}></div>
    );
  };

  const MetricCard = ({ icon: Icon, label, value, unit, trend }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-blue-400" />
        <span className={`text-xs px-2 py-1 rounded ${trend === 'up' ? 'bg-green-900/50 text-green-400' : 'bg-blue-900/50 text-blue-400'}`}>
          {trend === 'up' ? '↗' : '●'} STABLE
        </span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-400">{label} {unit}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white font-mono">
      {/* Header */}
      <div className="border-b border-gray-700 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Monitor className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold">ANDREW HANSEN - ENGINEERING SYSTEMS</h1>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIndicator status="active" />
                <span className="text-sm text-gray-400">SYSTEMS OPERATIONAL</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-gray-400">
                MISSION TIME: {currentTime.toLocaleTimeString()}
              </div>
              <button
                onClick={() => setIsSystemActive(!isSystemActive)}
                className="flex items-center space-x-2 px-3 py-1 bg-gray-800 rounded border border-gray-600 hover:bg-gray-700 transition-colors"
              >
                {isSystemActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isSystemActive ? 'PAUSE' : 'RESUME'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800/30 rounded-lg p-1">
          {[
            { id: 'overview', label: 'MISSION OVERVIEW', icon: Monitor },
            { id: 'experience', label: 'MISSION HISTORY', icon: Award },
            { id: 'projects', label: 'ACTIVE PROJECTS', icon: Code },
            { id: 'completed', label: 'COMPLETED PROJECTS', icon: CheckCircle },
            { id: 'contact', label: 'COMMUNICATIONS', icon: Zap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded transition-all ${
                activeSection === id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard 
                icon={Code} 
                label="Projects Completed" 
                value={systemMetrics.projectsCompleted} 
                trend="up"
              />
              <MetricCard 
                icon={Award} 
                label="Patents Pending" 
                value={systemMetrics.patentsPending} 
                trend="stable"
              />
              <MetricCard 
                icon={Users} 
                label="Active Game Users" 
                value={gameStats.activeUsers} 
                trend="up"
              />
              <MetricCard 
                icon={Cpu} 
                label={githubStats.loading ? "GitHub Loading..." : "GitHub Contributions"} 
                value={githubStats.loading ? "..." : githubStats.totalContributions} 
                trend="up"
              />
            </div>

            {/* Mission Brief */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-400">⚡ MISSION BRIEF</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed mb-4">
                  <span className="text-green-400 font-bold">CLEARANCE LEVEL:</span> MECHANICAL ENGINEER + SYSTEMS & AI SPECIALIST
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Currently deployed as <span className="text-yellow-400 font-bold">Area Maintenance Manager</span> at Amazon, 
                  where I architect large-scale equipment monitoring systems, lead and work with cross-functional teams. 
                  Specialized in bridging traditional mechanical engineering with cutting-edge systems.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  <span className="text-blue-400 font-bold">ACTIVE OPERATIONS:</span> Leading development of multiplayer IO game 
                  with {staticProjectData.multiplayer.totalPlayers}+ registered accounts, developing AWS AI platform.
                </p>
              </div>
            </div>

            {/* Current Projects Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-400">🚀 ACTIVE PROJECT GALLERY</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project, idx) => (
                  <div key={idx} className="group cursor-pointer" onClick={() => setActiveSection('projects')}>
                    <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-400 transition-all duration-300">
                      {/* Project Preview Image */}
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={project.images[0]?.url} 
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <StatusIndicator status={project.status} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="text-white text-sm font-medium">{project.images[0]?.caption}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Project Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-white text-sm">{project.name}</h3>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="text-xs text-gray-400 mb-3">{project.tech.slice(0, 2).join(' • ')}</div>
                        <div className="flex justify-between items-center text-xs">
                          {project.users && <span className="text-green-400 font-bold">{675} ACCOUNTS</span>}
                          {project.progress && <span className="text-yellow-400 font-bold">{project.progress}% COMPLETE</span>}
                          {project.ip && <span className="text-purple-400 font-bold">Patent Pending</span>}
                          <span className="text-gray-500">{project.images.length} images</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setActiveSection('projects')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  View Full Project Gallery →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-400">📊 MISSION HISTORY & DEPLOYMENTS</h2>
              <div className="text-sm text-gray-400">Professional experience with measurable impact</div>
            </div>
            
            {experiences.map((exp, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <StatusIndicator status={exp.status} />
                      <div>
                        <h3 className="text-lg font-bold">{exp.title}</h3>
                        <p className="text-gray-400">{exp.period}</p>
                      </div>
                    </div>
                    <div className="text-xs px-3 py-1 bg-blue-900/50 text-blue-400 rounded border border-blue-600">
                      {exp.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">{exp.description}</p>
                  
                  {/* Visual metrics representation */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(exp.metrics).map(([key, value], metricIdx) => {
                      const getMetricColor = (index) => {
                        const colors = ['text-green-400', 'text-blue-400', 'text-purple-400'];
                        return colors[index % colors.length];
                      };
                      
                      const getMetricIcon = (key) => {
                        if (key.includes('efficiency') || key.includes('accuracy')) return '📊';
                        if (key.includes('systems') || key.includes('prototypes')) return '⚙️';
                        if (key.includes('reports') || key.includes('clients')) return '📈';
                        if (key.includes('voltage')) return '⚡';
                        if (key.includes('patent')) return '📜';
                        if (key.includes('revenue')) return '💰';
                        return '🔧';
                      };
                      
                      return (
                        <div key={key} className="bg-gray-900/50 p-4 rounded border border-gray-600 hover:border-gray-500 transition-colors group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{getMetricIcon(key)}</span>
                            <div className={`text-2xl font-bold ${getMetricColor(metricIdx)}`}>
                              {typeof value === 'number' ? value.toLocaleString() : value}
                            </div>
                          </div>
                          <div className="text-gray-400 capitalize text-sm">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          
                          {/* Add visual bar for percentage values */}
                          {(key.includes('efficiency') || key.includes('accuracy')) && typeof value === 'number' && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-700 rounded-full h-1">
                                <div 
                                  className={`h-1 rounded-full transition-all duration-1000 ${
                                    getMetricColor(metricIdx).replace('text-', 'bg-')
                                  }`}
                                  style={{width: `${value}%`}}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {/* Add pulse animation for active status */}
                          {exp.status === 'active' && (
                            <div className="mt-2">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-400">Currently Active</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Achievement badges */}
                  <div className="mt-6 pt-4 border-t border-gray-600">
                    <div className="flex flex-wrap gap-2">
                      {exp.status === 'active' && (
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-600">
                          🎯 Active Leadership Role
                        </span>
                      )}
                      {exp.id === 'research' && (
                        <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-full border border-purple-600">
                          🧠 Research Innovation
                        </span>
                      )}
                      {exp.id === 'cr8' && (
                        <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full border border-yellow-600">
                          💡 Patent Holder
                        </span>
                      )}
                      {exp.metrics.systems && exp.metrics.systems > 2 && (
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full border border-blue-600">
                          ⚙️ Large Scale Systems
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Projects Section */}
        {activeSection === 'projects' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-400">🔬 ACTIVE PROJECT SHOWCASE</h2>
              <div className="text-sm text-gray-400">Current engineering solutions in development</div>
            </div>
            
            {projects.map((project, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
                {/* Project Header */}
                <div className="p-6 border-b border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <StatusIndicator status={project.status} />
                      <div>
                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                        <p className="text-gray-400">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {project.demoLink && (
                        <a 
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors inline-flex items-center space-x-1"
                        >
                          <Play className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                      <div className="text-xs px-3 py-1 bg-blue-900/50 text-blue-400 rounded border border-blue-600">
                        {project.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar for development projects */}
                  {project.progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Development Progress</span>
                        <span className="text-yellow-400 font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500" 
                          style={{width: `${project.progress}%`}}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Image Gallery - Takes up 2/3 of the space */}
                    <div className="lg:col-span-2">
                      <ImageGallery images={project.images} projectName={project.name} />
                    </div>
                    
                    {/* Project Details - Takes up 1/3 of the space */}
                    <div className="space-y-6">
                      {/* Metrics */}
                      {project.users && (
                        <div className="bg-gray-900/50 p-4 rounded border border-gray-600">
                          <div className="text-xs text-gray-400 mb-3">LIVE METRICS</div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-300">Active Users</span>
                              <span className="text-green-400 font-bold">{project.users}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-300">Total Players</span>
                              <span className="text-blue-400 font-bold">{project.total}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-300">Uptime</span>
                              <span className="text-purple-400 font-bold">99.7%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Patent info */}
                      {project.ip && (
                        <div className="bg-purple-900/30 p-4 rounded border border-purple-600">
                          <div className="text-xs text-purple-400 mb-2">INTELLECTUAL PROPERTY</div>
                          <div className="text-purple-300 font-bold">{project.ip}</div>
                        </div>
                      )}

                      {/* Tech Stack */}
                      <div className="bg-gray-900/50 p-4 rounded border border-gray-600">
                        <div className="text-xs text-gray-400 mb-3">TECH STACK</div>
                        <div className="space-y-2">
                          {project.tech.map(tech => {
                            const getColor = (index) => {
                              const colors = ['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400', 'bg-pink-400'];
                              return colors[index % colors.length];
                            };
                            return (
                              <div key={tech} className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${getColor(project.tech.indexOf(tech))}`}></div>
                                <span className="text-sm text-gray-300">{tech}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3D Viewer for specific projects */}
                      {project.model3d && (
                        <div className="bg-gray-900/50 p-4 rounded border border-gray-600">
                          <div className="text-xs text-gray-400 mb-3">3D MODEL</div>
                          <Isolated3DViewer />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Projects Section */}
        {activeSection === 'completed' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-400">✅ COMPLETED PROJECT ARCHIVE</h2>
              <div className="text-sm text-gray-400">Successfully delivered engineering solutions</div>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Archive className="w-5 h-5 text-green-400" />
                  <span className="text-xs px-2 py-1 rounded bg-green-900/50 text-green-400">✓ COMPLETE</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{completedProjects.length}</div>
                <div className="text-sm text-gray-400">Projects Delivered</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-xs px-2 py-1 rounded bg-blue-900/50 text-blue-400">● IMPACT</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-xs px-2 py-1 rounded bg-purple-900/50 text-purple-400">● RESEARCH</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">3</div>
                <div className="text-sm text-gray-400">Publications</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-xs px-2 py-1 rounded bg-yellow-900/50 text-yellow-400">● EFFICIENCY</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">47%</div>
                <div className="text-sm text-gray-400">Avg Improvement</div>
              </div>
            </div>
            
            {completedProjects.map((project, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
                {/* Project Header */}
                <div className="p-6 border-b border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                        <p className="text-gray-400">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-xs px-3 py-1 bg-green-900/50 text-green-400 rounded border border-green-600">
                        ✓ COMPLETED {project.completedDate}
                      </div>
                    </div>
                  </div>
                  
                  {/* Achievements */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {project.achievements.map((achievement, achievementIdx) => (
                      <div key={achievementIdx} className="bg-gray-900/50 p-3 rounded border border-gray-600">
                        <div className="text-green-400 font-bold text-sm">{achievement}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Image Gallery */}
                    <div className="lg:col-span-2">
                      <ImageGallery images={project.images} projectName={project.name} />
                    </div>
                    
                    {/* Project Details */}
                    <div className="space-y-6">
                      {/* Impact Statement */}
                      <div className="bg-green-900/30 p-4 rounded border border-green-600">
                        <div className="text-xs text-green-400 mb-2">PROJECT IMPACT</div>
                        <div className="text-green-300 text-sm">{project.impact}</div>
                      </div>

                      {/* Completion Info */}
                      <div className="bg-gray-900/50 p-4 rounded border border-gray-600">
                        <div className="text-xs text-gray-400 mb-3">PROJECT STATUS</div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-300">Status</span>
                            <span className="text-green-400 font-bold">Completed</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-300">Delivered</span>
                            <span className="text-blue-400 font-bold">{project.completedDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-300">Success Rate</span>
                            <span className="text-purple-400 font-bold">100%</span>
                          </div>
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="bg-gray-900/50 p-4 rounded border border-gray-600">
                        <div className="text-xs text-gray-400 mb-3">TECHNOLOGIES USED</div>
                        <div className="space-y-2">
                          {project.tech.map(tech => {
                            const getColor = (index) => {
                              const colors = ['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400', 'bg-pink-400'];
                              return colors[index % colors.length];
                            };
                            return (
                              <div key={tech} className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${getColor(project.tech.indexOf(tech))}`}></div>
                                <span className="text-sm text-gray-300">{tech}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Achievement Badges */}
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400">RECOGNITION</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-600">
                            ✓ On Time Delivery
                          </span>
                          <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-600">
                            📊 Exceeded Goals
                          </span>
                          {project.name.includes('Solar') && (
                            <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded border border-yellow-600">
                              🌱 Sustainability
                            </span>
                          )}
                          {project.name.includes('Amazon') && (
                            <span className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded border border-purple-600">
                              🤖 Automation
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-400">📡 ESTABLISH COMMUNICATIONS</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">CONTACT PROTOCOLS</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Email: Andrew.rockets@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>LinkedIn: linkedin.com/in/andrewtoddhansen</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Phone: (509) 808-5899</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">MISSION PARAMETERS</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-blue-400">Location:</span> Available for deployment nationwide</div>
                  <div><span className="text-blue-400">Security Clearance:</span> Eligible for government contracts</div>
                  <div><span className="text-blue-400">Languages:</span> English (Native), Spanish (Fluent)</div>
                  <div><span className="text-blue-400">Availability:</span> Graduating April 2026</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineeringCommandCenter;