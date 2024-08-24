"use client"

import Image from 'next/image';
import { motion } from 'framer-motion';
import DynamicNavbar from "../components/DynamicNavbar";

const TeamPage = () => {
    const team = [
        {
            avatar: "/pranav_img.jpg",
            name: "Pranav Chhabra",
            title: "Full Stack Developer",
            desc: "Computer Science grad who loves AI, coding, and creating cool things. When I'm not at the keyboard, I'm in the kitchen, at the gym, or making new friends. Always up for a chat, feel free to reach out!",
            linkedin: "https://www.linkedin.com/in/pranavchhabra/",
            github: "https://github.com/pc9350"
        },
        {
            avatar: "/isha_img.jpeg",
            name: "Isha Shreshtha",
            title: "Full Stack Developer",
            desc: "A Student who loves to code and build cool stuff. I am passionate about learning new technologies and building projects. Feel free to reach out!",
            linkedin: "https://www.linkedin.com/in/isha-shrestha/",
            github: "https://github.com/isha038"
        },
        {
            avatar: "/Rakesh_img.jpeg",
            name: "Rakesh Puppala",
            title: "Full Stack Developer",
            desc: "Full Stack Engineer skilled in building dynamic, secure, and scalable applications. Expertise in Nextjs, Express, and automation pipelines to drive efficient deployment and robust user experiences.",
            linkedin: "https://www.linkedin.com/in/rakesh-puppala/",
            github: "https://github.com/rakeshpuppala2590"
        },
        {
            avatar: "/jason_img.jpeg",
            name: "Jason Zhang",
            title: "Full Stack Developer",
            desc: "Graduate From App Academy, Proficent in Rails, MERN, JavaScript, HTML / CCS. Highly interested in AI.",
            linkedin: "https://www.linkedin.com/in/swejasonzhang/",
            github: "https://github.com/swejasonzhang"
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
            <DynamicNavbar />
            <section className="py-14">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-screen-xl mx-auto px-4 md:px-8"
                >
                    <div className="text-center">
                        <motion.h1 
                            className="mt-8 text-white text-4xl font-bold sm:text-5xl"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            Meet Our Amazing Team!
                        </motion.h1>
                        <motion.p 
                            className="text-indigo-200 mt-3 italic"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Passionate engineers building products that users love.
                        </motion.p>
                    </div>
                    <div className="mt-12">
                        <ul className="grid gap-8 lg:grid-cols-2">
                            {team.map((item, idx) => (
                                <motion.li 
                                    key={idx}
                                    className="flex flex-col sm:flex-row bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg overflow-hidden"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className="w-full sm:w-2/5 h-60 sm:h-auto relative">
                                        <Image
                                            src={item.avatar}
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition-transform duration-300 ease-in-out transform hover:scale-105"
                                            alt={item.name}
                                        />
                                    </div>
                                    <div className="p-4 sm:w-3/5 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-xl text-white font-semibold">{item.name}</h4>
                                            <p className="text-indigo-300 font-medium">{item.title}</p>
                                            <p className="text-gray-300 mt-2 text-sm">{item.desc}</p>
                                        </div>
                                        <div className="mt-4 flex gap-4 text-indigo-300">
                                            <a href={item.github} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-white">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                            <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-white">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}

export default TeamPage;