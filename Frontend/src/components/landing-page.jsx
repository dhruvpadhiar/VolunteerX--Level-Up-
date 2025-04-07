"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, MessageSquare, Leaf, Calendar, Globe, ExternalLink } from "lucide-react"

export default function LandingPage() {
  const navigate = useNavigate()
  const [animateStats, setAnimateStats] = useState(false)
  const statsRef = useRef(null)
  const [activeNgoIndex, setActiveNgoIndex] = useState(0)

  // Navigation handlers
  const onSubmitHandler = () => {
    navigate("/signup")
  }

  const onLoginHandler = () => {
    navigate("/login")
  }

  // NGO partners data
  const ngoPartners = [
    {
      name: "PETA",
      description: "Animal Rights",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUjCmxyEpa31g3DygbDAAV7CxBnqjLTP_r-A&s?height=80&width=80",
    },
    {
      name: "WWF",
      description: "Wildlife Conservation",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwgmuCZ4GkFsYzzOQKrN7GPCEsqdKJXXaHNA&s?height=80&width=80",
    },
    {
      name: "Greenpeace",
      description: "Environmental Protection",
      logo: "https://images.icon-icons.com/2699/PNG/512/greenpeace_logo_icon_169063.png?height=80&width=80",
    },
    {
      name: "UNICEF",
      description: "Children's Rights",
      logo: "https://1000logos.net/wp-content/uploads/2021/03/UNICEF-logo.jpg?height=80&width=80",
    },
    {
      name: "Red Cross",
      description: "Humanitarian Aid",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_the_Red_Cross.png?height=80&width=80",
    },
  ]

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Volunteer",
      text: "Joining this platform changed my life. I've participated in over 15 beach cleanups and made lifelong friends along the way.",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnS1o3mO3S_Nkfw1WAGaRJ6KaOGgODpfoOsA&s?height=60&width=60",
    },
    {
      name: "Michael Chen",
      role: "NGO Coordinator",
      text: "As a small environmental NGO, we struggled to find volunteers. This platform connected us with passionate people who truly care about our cause.",
      avatar:
        "https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg?height=60&width=60",
    },
    {
      name: "Priya Sharma",
      role: "Regular Volunteer",
      text: "The community here is incredible. I love being able to share my experiences and see the impact we're making together.",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUKa8rdbebgLF1SzLQN71RnKi-vxiJrKCeSnvK3rxt-PNc732MAn6oSlgpNaB2hr2ppSw&usqp=CAU?height=60&width=60",
    },
  ]

  // FAQs data
  const faqs = [
    {
      question: "How do I sign up as a volunteer?",
      answer:
        "Signing up is easy! Just click on the 'Join Our Community' button, fill out a simple form with your interests and availability, and you're ready to start volunteering.",
    },
    {
      question: "Can NGOs post their events for free?",
      answer:
        "Yes, NGOs can create an account by clicking 'Work With Us' and post their events at no cost. We believe in making connections between volunteers and organizations as accessible as possible.",
    },
    {
      question: "How can I share my volunteering experience?",
      answer:
        "After participating in an event, you'll have the option to create a post about your experience, upload photos, and share it with the community. Your stories inspire others to get involved!",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes, we have mobile apps for both iOS and Android. You can download them from the App Store or Google Play to stay connected on the go.",
    },
    {
      question: "Can I organize my own volunteering event?",
      answer:
        "Individual members can propose and organize events. Once you've participated in at least 3 events, you'll gain the ability to create your own initiatives.",
    },
  ]

  // Animate stats when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimateStats(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Rotate NGO cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNgoIndex((prev) => (prev + 1) % ngoPartners.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [ngoPartners.length])

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Count up animation for stats
  const CountUpStat = ({ end, label, delay = 0 }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!animateStats) return

      let start = 0
      const duration = 2000
      const increment = end / (duration / 16)
      let timer

      const timeout = setTimeout(() => {
        timer = setInterval(() => {
          start += increment
          if (start >= end) {
            setCount(end)
            clearInterval(timer)
          } else {
            setCount(Math.floor(start))
          }
        }, 16)
      }, delay)

      return () => {
        clearTimeout(timeout)
        if (timer) clearInterval(timer)
      }
    }, [animateStats, end, delay])

    return (
      <div className="space-y-2" style={{ animationDelay: `${delay}ms` }}>
        <h4 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {animateStats ? count : 0}+
        </h4>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">VolunteerX</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <button
              onClick={() => scrollToSection("about")}
              className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("partners")}
              className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Partners
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              FAQ
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={onLoginHandler}
              className="hidden sm:flex transition-all hover:bg-primary/10 hover:border-primary border rounded-md px-4 py-2 text-sm font-medium"
            >
              Login
            </button>
            <button
              onClick={onSubmitHandler}
              className="transition-all hover:bg-primary/90 hover:scale-105 bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
            >
              Register
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          <div className="container relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-24">
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-6">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Connect, Volunteer,{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Make an Impact
                    </span>
                  </h1>
                  <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Join our community of passionate volunteers and NGOs working together to create positive change.
                    Share your experiences and inspire others to take action.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="gap-2 transition-all hover:bg-primary/90 hover:scale-105 group bg-primary text-primary-foreground rounded-md px-6 py-3 text-base font-medium inline-flex items-center">
                    Join Our Community
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button className="transition-all hover:bg-primary/10 hover:border-primary border rounded-md px-6 py-3 text-base font-medium">
                    Work With Us
                  </button>
                </div>
              </div>
              <div className="relative hidden lg:block animate-slide-up">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/10 rounded-2xl blur-3xl" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1681830426010-f68a0a25aebe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fHZvbHVudGVlcnxlbnwwfHwwfHx8MA%3D%3D"
                    alt="Volunteers working together"
                    className="object-cover w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-muted/30 py-24" ref={statsRef}>
          <div className="container space-y-12">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Making a Difference Together
            </h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              <div className="border border-primary/20 transition-all hover:border-primary/50 hover:shadow-md rounded-lg">
                <div className="p-6 space-y-2">
                  <Calendar className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Organize Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and join volunteering events from beach cleanups to food drives. Make a real impact in your
                    community.
                  </p>
                </div>
              </div>
              <div className="border border-primary/20 transition-all hover:border-primary/50 hover:shadow-md rounded-lg">
                <div className="p-6 space-y-2">
                  <MessageSquare className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Share Stories</h3>
                  <p className="text-sm text-muted-foreground">
                    Post about your volunteering experiences and inspire others with your journey of making a
                    difference.
                  </p>
                </div>
              </div>
              <div className="border border-primary/20 transition-all hover:border-primary/50 hover:shadow-md rounded-lg">
                <div className="p-6 space-y-2">
                  <Globe className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Connect with NGOs</h3>
                  <p className="text-sm text-muted-foreground">
                    Build relationships with organizations that align with your values and support causes you care
                    about.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-3xl mx-auto">
              <div className={`space-y-2 ${animateStats ? "animate-count-up" : "opacity-0"}`}>
                <CountUpStat end={250} label="Successful Events" />
              </div>
              <div
                className={`space-y-2 ${animateStats ? "animate-count-up" : "opacity-0"}`}
                style={{ animationDelay: "200ms" }}
              >
                <CountUpStat end={5000} label="Active Volunteers" delay={200} />
              </div>
              <div
                className={`space-y-2 ${animateStats ? "animate-count-up" : "opacity-0"}`}
                style={{ animationDelay: "400ms" }}
              >
                <CountUpStat end={1200} label="Stories Shared" delay={400} />
              </div>
            </div>
          </div>
        </section>

        <section id="partners" className="py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our NGO{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Partners
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
                We collaborate with leading organizations committed to creating positive change around the world.
              </p>
            </div>
            <div className="max-w-4xl mx-auto relative h-[200px]">
              <div className="flex justify-center items-center h-full">
                {ngoPartners.map((ngo, index) => (
                  <div
                    key={ngo.name}
                    className={`absolute transition-all duration-500 ease-in-out ${
                      index === activeNgoIndex
                        ? "opacity-100 scale-100 z-10 translate-x-0"
                        : index === (activeNgoIndex + 1) % ngoPartners.length
                          ? "opacity-40 scale-90 translate-x-[60%] z-0"
                          : index === (activeNgoIndex - 1 + ngoPartners.length) % ngoPartners.length
                            ? "opacity-40 scale-90 translate-x-[-60%] z-0"
                            : "opacity-0 scale-75 z-0"
                    }`}
                  >
                    <div className="w-[300px] h-[180px] flex flex-col items-center justify-center p-6 border border-primary/20 transition-all hover:border-primary/50 rounded-lg">
                      <img
                        src={ngo.logo || "/placeholder.svg"}
                        alt={ngo.name}
                        width={80}
                        height={80}
                        className="mb-4"
                      />
                      <h3 className="text-xl font-bold">{ngo.name}</h3>
                      <p className="text-sm text-muted-foreground">{ngo.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-muted/30 py-24">
          <div className="container space-y-12">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
              What Our{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Community
              </span>{" "}
              Says
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="border border-primary/20 transition-all hover:border-primary/50 hover:shadow-md rounded-lg"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
                Find answers to common questions about our volunteering platform.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="w-full">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-primary/20">
                    <button
                      className="flex w-full justify-between py-4 text-left hover:text-primary transition-colors font-medium"
                      onClick={(e) => {
                        const content = e.currentTarget.nextElementSibling
                        content.style.display = content.style.display === "block" ? "none" : "block"
                      }}
                    >
                      {faq.question}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 transition-transform"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    <div className="text-muted-foreground pb-4 hidden">{faq.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">VolunteerX</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting passionate volunteers with impactful causes to create positive change in communities
                worldwide.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => scrollToSection("about")} className="hover:text-primary transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("partners")} className="hover:text-primary transition-colors">
                    Our Partners
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="hover:text-primary transition-colors"
                  >
                    Testimonials
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("faq")} className="hover:text-primary transition-colors">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Get Involved</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                    Join Our Community <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                    Work With Us <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Upcoming Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Us</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>VolunteerX@gmail.com</li>
                <li>+91 8888888888</li>
                <li>Mumbai, India</li>
                <li className="flex space-x-4 pt-2">
                  <a href="#" className="hover:text-primary transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 VolunteerX. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

