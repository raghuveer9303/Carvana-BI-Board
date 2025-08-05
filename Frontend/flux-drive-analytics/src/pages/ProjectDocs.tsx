import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  Database,
  Cloud,
  Activity,
  GitBranch,
  Layers,
  Workflow,
  BarChart3,
  Server,
  Globe,
  Zap,
  Target,
  Users,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertCircle,
  Code,
  Cpu,
  HardDrive,
  Network,
  Calendar,
  Clock,
  DollarSign,
  Car,
  LineChart,
  PieChart,
  Settings,
  RefreshCw,
  FileText,
  Archive,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const ProjectDocs = () => {
  return (
    <div className="min-h-screen bg-dashboard-bg font-body">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh opacity-30"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass border-b border-border/20 backdrop-blur-apple shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-foreground">
                    Project Documentation
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Carvana Analytics Platform Overview
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1 rounded-full glass border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              v1.0
            </Badge>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                Carvana Analytics Platform
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A comprehensive data pipeline and analytics solution for real-time vehicle market intelligence
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="px-4 py-2 bg-gradient-primary text-white border-0">
                <Database className="h-4 w-4 mr-2" />
                Data Engineering
              </Badge>
              <Badge className="px-4 py-2 bg-gradient-success text-white border-0">
                <BarChart3 className="h-4 w-4 mr-2" />
                Real-time Analytics
              </Badge>
              <Badge className="px-4 py-2 bg-gradient-warning text-white border-0">
                <Cloud className="h-4 w-4 mr-2" />
                Modern Stack
              </Badge>
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-6 w-full max-w-4xl glass backdrop-blur-apple">
              <TabsTrigger value="overview" className="gap-2">
                <Target className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="architecture" className="gap-2">
                <Layers className="h-4 w-4" />
                Architecture
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="gap-2">
                <Workflow className="h-4 w-4" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger value="technologies" className="gap-2">
                <Code className="h-4 w-4" />
                Tech Stack
              </TabsTrigger>
              <TabsTrigger value="features" className="gap-2">
                <Zap className="h-4 w-4" />
                Features
              </TabsTrigger>
              <TabsTrigger value="metrics" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Metrics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Goals */}
              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="h-6 w-6 text-primary" />
                    Project Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Real-time Market Intelligence</h4>
                        <p className="text-sm text-muted-foreground">Track vehicle inventory changes and sales patterns in real-time</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Automated Data Pipeline</h4>
                        <p className="text-sm text-muted-foreground">Daily scraping and processing of Carvana's vehicle listings</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Business Analytics</h4>
                        <p className="text-sm text-muted-foreground">Comprehensive dashboards for inventory and sales analysis</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Platform Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-gradient-primary/10 border border-primary/20">
                      <Car className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">50K+</div>
                      <div className="text-xs text-muted-foreground">Vehicles Tracked</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-success/10 border border-success/20">
                      <RefreshCw className="h-8 w-8 text-success mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">Daily</div>
                      <div className="text-xs text-muted-foreground">Data Updates</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-warning/10 border border-warning/20">
                      <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">Real-time</div>
                      <div className="text-xs text-muted-foreground">Analytics</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-info/10 border border-info/20">
                      <TrendingUp className="h-8 w-8 text-info mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">15+</div>
                      <div className="text-xs text-muted-foreground">KPI Metrics</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Problem Statement */}
            <Card className="glass backdrop-blur-apple border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <AlertCircle className="h-6 w-6 text-warning" />
                  Problem Statement & Solution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">The Challenge</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-error mt-2"></div>
                        <span>Manual tracking of vehicle inventory changes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-error mt-2"></div>
                        <span>Lack of real-time market intelligence</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-error mt-2"></div>
                        <span>No automated sales pattern analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-error mt-2"></div>
                        <span>Limited business insights from raw data</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Our Solution</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                        <span>Automated daily web scraping pipeline</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                        <span>Real-time data processing with Apache Spark</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                        <span>Modern analytics dashboard with live updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                        <span>Dimensional data modeling for business intelligence</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-8">
            {/* Architecture Diagram */}
            <Card className="glass backdrop-blur-apple border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Layers className="h-6 w-6 text-primary" />
                  System Architecture
                </CardTitle>
                <CardDescription>
                  High-level overview of the data pipeline and analytics platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative p-8 bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl border border-border/20">
                  {/* Data Sources Layer */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Data Sources</h3>
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-primary/10 border border-primary/20 rounded-xl">
                        <Globe className="h-5 w-5 text-primary" />
                        <span className="font-medium">Carvana Website</span>
                      </div>
                    </div>
                  </div>

                  {/* Ingestion Layer */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Data Ingestion</h3>
                    <div className="flex justify-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-success/10 border border-success/20 rounded-xl">
                        <Activity className="h-5 w-5 text-success" />
                        <span className="font-medium">Web Scraper</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-warning/10 border border-warning/20 rounded-xl">
                        <Archive className="h-5 w-5 text-warning" />
                        <span className="font-medium">MinIO Storage</span>
                      </div>
                    </div>
                  </div>

                  {/* Processing Layer */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Data Processing</h3>
                    <div className="flex justify-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-info/10 border border-info/20 rounded-xl">
                        <Cpu className="h-5 w-5 text-info" />
                        <span className="font-medium">Apache Spark</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-primary/10 border border-primary/20 rounded-xl">
                        <Workflow className="h-5 w-5 text-primary" />
                        <span className="font-medium">Apache Airflow</span>
                      </div>
                    </div>
                  </div>

                  {/* Storage Layer */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Data Storage</h3>
                    <div className="flex justify-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-success/10 border border-success/20 rounded-xl">
                        <HardDrive className="h-5 w-5 text-success" />
                        <span className="font-medium">Apache Iceberg</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-warning/10 border border-warning/20 rounded-xl">
                        <Database className="h-5 w-5 text-warning" />
                        <span className="font-medium">PostgreSQL</span>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Layer */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Analytics & Visualization</h3>
                    <div className="flex justify-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-info/10 border border-info/20 rounded-xl">
                        <BarChart3 className="h-5 w-5 text-info" />
                        <span className="font-medium">React Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-primary/10 border border-primary/20 rounded-xl">
                        <Server className="h-5 w-5 text-primary" />
                        <span className="font-medium">FastAPI Backend</span>
                      </div>
                    </div>
                  </div>

                  {/* Connection Lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 400 300">
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                         refX="0" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-muted-foreground/30" />
                        </marker>
                      </defs>
                      <line x1="200" y1="50" x2="200" y2="90" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30" markerEnd="url(#arrowhead)" />
                      <line x1="200" y1="130" x2="200" y2="170" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30" markerEnd="url(#arrowhead)" />
                      <line x1="200" y1="210" x2="200" y2="250" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30" markerEnd="url(#arrowhead)" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    Data Extraction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Automated web scraping of Carvana listings using containerized Python scrapers
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">Docker Containers</Badge>
                    <Badge variant="outline" className="text-xs">Selenium WebDriver</Badge>
                    <Badge variant="outline" className="text-xs">Daily Schedule</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 rounded-lg bg-gradient-success flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    Processing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Real-time data transformation and change detection using Apache Spark
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">Apache Spark</Badge>
                    <Badge variant="outline" className="text-xs">Change Detection</Badge>
                    <Badge variant="outline" className="text-xs">Data Validation</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 rounded-lg bg-gradient-warning flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Interactive dashboards with real-time KPIs and business intelligence
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">React + TypeScript</Badge>
                    <Badge variant="outline" className="text-xs">Real-time Updates</Badge>
                    <Badge variant="outline" className="text-xs">Modern UI</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pipeline Tab */}
          <TabsContent value="pipeline" className="space-y-8">
            {/* Daily Pipeline */}
            <Card className="glass backdrop-blur-apple border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Calendar className="h-6 w-6 text-primary" />
                  Daily Data Pipeline
                </CardTitle>
                <CardDescription>
                  Automated daily workflow for vehicle data collection and processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Web Scraping",
                      description: "Extract all vehicle listings from Carvana website",
                      time: "~10-15 minutes",
                      color: "primary"
                    },
                    {
                      step: 2,
                      title: "Data Validation",
                      description: "Validate scraped data quality and completeness",
                      time: "~2 minutes",
                      color: "warning"
                    },
                    {
                      step: 3,
                      title: "Raw Data Loading",
                      description: "Load today's snapshot into Iceberg raw table",
                      time: "~3 minutes",
                      color: "success"
                    },
                    {
                      step: 4,
                      title: "Change Detection",
                      description: "Identify new vehicles, sold vehicles, and price changes",
                      time: "~5 minutes",
                      color: "info"
                    },
                    {
                      step: 5,
                      title: "URL Generation",
                      description: "Generate URLs for detailed vehicle information scraping",
                      time: "~2 minutes",
                      color: "primary"
                    },
                    {
                      step: 6,
                      title: "Dimensional Update",
                      description: "Trigger dimensional modeling pipeline",
                      time: "~10 minutes",
                      color: "success"
                    }
                  ].map((task, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/20">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-${task.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-sm">{task.step}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{task.title}</h3>
                          <Badge variant="outline" className="text-xs">{task.time}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Pipeline */}
            <Card className="glass backdrop-blur-apple border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Clock className="h-6 w-6 text-success" />
                  Weekly Enhancement Pipeline
                </CardTitle>
                <CardDescription>
                  Detailed vehicle information collection and data enrichment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Detailed Scraping Process</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <span className="font-medium">Vehicle Details</span>
                          <p className="text-sm text-muted-foreground">Engine specs, features, history</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <span className="font-medium">High-res Images</span>
                          <p className="text-sm text-muted-foreground">Interior and exterior photos</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <span className="font-medium">Condition Reports</span>
                          <p className="text-sm text-muted-foreground">Damage assessments and ratings</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Data Enhancement</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <span className="font-medium">Price History</span>
                          <p className="text-sm text-muted-foreground">Track price changes over time</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <span className="font-medium">Market Analysis</span>
                          <p className="text-sm text-muted-foreground">Comparable vehicle pricing</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <span className="font-medium">Sales Velocity</span>
                          <p className="text-sm text-muted-foreground">Time on lot calculations</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technologies Tab */}
          <TabsContent value="technologies" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Data Processing */}
              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Cpu className="h-6 w-6 text-primary" />
                    Data Processing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Workflow className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Apache Airflow</div>
                        <div className="text-xs text-muted-foreground">Workflow Orchestration</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Apache Spark</div>
                        <div className="text-xs text-muted-foreground">Big Data Processing</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-warning rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Python</div>
                        <div className="text-xs text-muted-foreground">Data Engineering</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Storage & Data */}
              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Database className="h-6 w-6 text-success" />
                    Storage & Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-info rounded-lg flex items-center justify-center">
                        <HardDrive className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Apache Iceberg</div>
                        <div className="text-xs text-muted-foreground">Data Lake Tables</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Database className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">PostgreSQL</div>
                        <div className="text-xs text-muted-foreground">Analytics Database</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-warning rounded-lg flex items-center justify-center">
                        <Archive className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">MinIO</div>
                        <div className="text-xs text-muted-foreground">Object Storage</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Frontend & APIs */}
              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Globe className="h-6 w-6 text-info" />
                    Frontend & APIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center">
                        <Code className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">React + TypeScript</div>
                        <div className="text-xs text-muted-foreground">Frontend Dashboard</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Server className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">FastAPI</div>
                        <div className="text-xs text-muted-foreground">Backend API</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-info rounded-lg flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Tailwind CSS</div>
                        <div className="text-xs text-muted-foreground">Modern Styling</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DevOps & Infrastructure */}
              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Settings className="h-6 w-6 text-warning" />
                    DevOps & Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Network className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Docker</div>
                        <div className="text-xs text-muted-foreground">Containerization</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center">
                        <GitBranch className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Git & GitHub</div>
                        <div className="text-xs text-muted-foreground">Version Control</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 bg-gradient-warning rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Monitoring</div>
                        <div className="text-xs text-muted-foreground">Health Checks</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dashboard Features */}
              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Dashboard Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <LineChart className="h-5 w-5 text-success mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Real-time KPIs</h4>
                        <p className="text-sm text-muted-foreground">Live inventory count, daily sales, average sale price, and market velocity metrics</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <PieChart className="h-5 w-5 text-info mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Interactive Charts</h4>
                        <p className="text-sm text-muted-foreground">Daily sales trends, inventory distribution, and brand performance analytics</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-warning mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Trend Analysis</h4>
                        <p className="text-sm text-muted-foreground">Historical data analysis with growth indicators and market insights</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RefreshCw className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Live Updates</h4>
                        <p className="text-sm text-muted-foreground">Automatic data refresh with manual refresh capability and sync indicators</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Features */}
              <Card className="glass backdrop-blur-apple border-0 shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Database className="h-6 w-6 text-success" />
                    Data Pipeline Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-success mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Automated Scraping</h4>
                        <p className="text-sm text-muted-foreground">Daily automated collection of vehicle listings with error handling and retries</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-warning mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Change Detection</h4>
                        <p className="text-sm text-muted-foreground">Intelligent detection of new listings, sold vehicles, and price changes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-info mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Data Validation</h4>
                        <p className="text-sm text-muted-foreground">Comprehensive data quality checks and validation rules</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Layers className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Dimensional Modeling</h4>
                        <p className="text-sm text-muted-foreground">Star schema design for optimized analytics and business intelligence</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Business Value */}
            <Card className="glass backdrop-blur-apple border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <DollarSign className="h-6 w-6 text-success" />
                  Business Value & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">Market Intelligence</h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time insights into vehicle market trends, pricing patterns, and inventory dynamics
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">Time Savings</h3>
                    <p className="text-sm text-muted-foreground">
                      Automated data collection eliminates hours of manual tracking and analysis work
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-warning rounded-2xl flex items-center justify-center mx-auto">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">Decision Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Data-driven insights for inventory management, pricing strategies, and market positioning
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-8">
            {/* System Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass backdrop-blur-apple border-0 shadow-card text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">Pipeline Uptime</div>
                </CardContent>
              </Card>

              <Card className="glass backdrop-blur-apple border-0 shadow-card text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">25min</div>
                  <div className="text-sm text-muted-foreground">Avg Processing Time</div>
                </CardContent>
              </Card>

              <Card className="glass backdrop-blur-apple border-0 shadow-card text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-warning rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">2.5M</div>
                  <div className="text-sm text-muted-foreground">Records Processed</div>
                </CardContent>
              </Card>

              <Card className="glass backdrop-blur-apple border-0 shadow-card text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-info rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">&lt;200ms</div>
                  <div className="text-sm text-muted-foreground">API Response Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Data Insights */}
            <Card className="glass backdrop-blur-apple border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  Data Insights & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground">Market Insights</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm font-medium">Average Days to Sell</span>
                        <Badge variant="outline">45 days</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm font-medium">Price Range Distribution</span>
                        <Badge variant="outline">$15K-$35K peak</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm font-medium">Top Selling Brand</span>
                        <Badge variant="outline">Toyota</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm font-medium">Inventory Turnover</span>
                        <Badge variant="outline">8.1x annually</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground">Platform Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm font-medium">Data Freshness</span>
                        <Badge variant="outline" className="bg-success/10 text-success">Live</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm font-medium">Error Rate</span>
                        <Badge variant="outline" className="bg-success/10 text-success">0.1%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm font-medium">Data Coverage</span>
                        <Badge variant="outline">98.5%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm font-medium">Storage Efficiency</span>
                        <Badge variant="outline">85% compressed</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Future Roadmap */}
            <Card className="glass backdrop-blur-apple border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Sparkles className="h-6 w-6 text-info" />
                  Future Enhancements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Planned Features</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <span className="text-sm text-muted-foreground">Machine learning price prediction models</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                        <span className="text-sm text-muted-foreground">Advanced alerting and notifications</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                        <span className="text-sm text-muted-foreground">Mobile-responsive dashboard</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-info mt-2"></div>
                        <span className="text-sm text-muted-foreground">API integration for third-party tools</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Technical Improvements</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <span className="text-sm text-muted-foreground">Kubernetes deployment for scalability</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                        <span className="text-sm text-muted-foreground">Enhanced monitoring and observability</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                        <span className="text-sm text-muted-foreground">Real-time streaming data processing</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-info mt-2"></div>
                        <span className="text-sm text-muted-foreground">Advanced data quality monitoring</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            Built with modern data engineering principles and designed for scalability
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProjectDocs;
