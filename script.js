// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background opacity on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(20, 20, 20, 0.95)';
        navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.borderBottom = '1px solid transparent';
        navbar.style.backdropFilter = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.spec-card, .alliance-card, .sponsor-card, .season-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Donate button functionality
document.querySelector('.donate-btn').addEventListener('click', (e) => {
    // Only redirect if it's not already a link (i.e., on the home page)
    if (e.target.tagName === 'BUTTON') {
        e.preventDefault();
        window.open('https://hcb.hackclub.com/donations/start/regression-robotics', '_blank');
    }
});

// CTA button functionality
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        window.location.href = 'about.html';
    });
}

// Tier button functionality
document.querySelectorAll('.tier-button').forEach(button => {
    button.addEventListener('click', () => {
        alert('Thank you for your interest in sponsoring Regression Robotics! Please contact us at regressionrobotics@gmail.com to discuss sponsorship opportunities.');
    });
});

// Type button functionality
document.querySelectorAll('.type-button').forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent;
        if (buttonText === 'Donate Now') {
            window.open('https://hcb.hackclub.com/donations/start/regression-robotics', '_blank');
        } else if (buttonText === 'Contact Us') {
            alert('Please reach out to us at regressionrobotics@gmail.com for in-kind donation opportunities.');
        } else if (buttonText === 'Become a Mentor') {
            alert('We would love to have you as a mentor! Please contact us at regressionrobotics@gmail.com to get started.');
        }
    });
});

// Update CTA button for about page navigation
const aboutSection = document.querySelector('#about');
if (!aboutSection && ctaButton) {
    // If we're not on the home page, update the CTA button behavior
    document.querySelector('#about').scrollIntoView({
        behavior: 'smooth'
    });
}

// Add glow effect to cards on hover
document.querySelectorAll('.spec-card, .alliance-card, .sponsor-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(220, 38, 38, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});

// Parallax effect for hero section (removed since no hero image)

// Dynamic stats counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// FTCScout API Integration
document.addEventListener('DOMContentLoaded', function() {
    // Fetch FTCScout GraphQL data with retry
    async function fetchWithRetry(url, options, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.ok) return response;
                throw new Error('Network response was not ok');
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    async function fetchSeasonData() {
        const seasonDataDiv = document.getElementById('season-data');
        
        if (!seasonDataDiv) return; // Only run on season page
        
        const query = `
            query {
                teamByNumber(number: 30432) {
                    number
                    name
                    matches(season: 2025) {
                        match {
                            matchNum
                            scheduledStartTime
                            teams {
                                team {
                                    name
                                }
                                alliance
                            }
                            scores {
                                ... on MatchScores2024 {
                                    matchId
                                    blue {
                                        alliance
                                        totalPoints
                                    }
                                    red {
                                        alliance
                                        totalPoints
                                    }
                                }
                            }
                        }
                    }
                    quickStats(season: 2025) {
                        auto {
                            rank
                        }
                    }
                }
            }
        `;

        try {
            const response = await fetchWithRetry('https://api.ftcscout.org/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            let content = `<h3>Team 30432 - 2025 Season</h3>`;

            if (data.data?.teamByNumber?.matches?.length > 0) {
                content += '<ul>';
                data.data.teamByNumber.matches.forEach(match => {
                    const blueScore = match.match.scores?.blue?.totalPoints || 'N/A';
                    const redScore = match.match.scores?.red?.totalPoints || 'N/A';
                    const matchDate = match.match.scheduledStartTime ? 
                        new Date(match.match.scheduledStartTime).toLocaleString() : 'TBD';
                    
                    content += `
                        <li>
                            <strong>Match ${match.match.matchNum}</strong><br>
                            Blue Alliance: ${blueScore} points<br>
                            Red Alliance: ${redScore} points<br>
                            <small>Scheduled: ${matchDate}</small>
                        </li>
                    `;
                });
                content += '</ul>';
            } else {
                content += '<p>No match data available for the 2025 season yet.</p>';
            }

            if (data.data?.teamByNumber?.quickStats?.auto?.rank) {
                content += `<div class="rank-info">Current Auto Rank: ${data.data.teamByNumber.quickStats.auto.rank}</div>`;
            }

            seasonDataDiv.innerHTML = content;

        } catch (error) {
            seasonDataDiv.innerHTML = '<p class="error">Unable to load 2025 season data at this time. Check back later!</p>';
            console.error('Error fetching season data:', error);
        }
    }

    // Load season data on page load
    fetchSeasonData();
});

