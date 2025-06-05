// Loading screen functionality
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Hide loading screen after animation
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
    }, 2000);
});

// Handle page transitions
document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Check if the click is on a navigation link
    if (target.tagName === 'A' || 
        (target.classList && 
         (target.classList.contains('header_element') || 
          target.classList.contains('project_button')))) {
        
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.classList.remove('fade-out');
        
        // Reset loading progress
        const progress = loadingScreen.querySelector('.loading-progress');
        progress.style.animation = 'none';
        progress.offsetHeight; // Trigger reflow
        progress.style.animation = 'loading 2s ease-in-out forwards';
    }
});

// Cursor circle animation
const cursorCircle = document.querySelector('.cursor-circle');
let mouseX = 0;
let mouseY = 0;
let circleX = 0;
let circleY = 0;

// Function to check if element is dark
function isDarkBackground(element) {
    const darkElements = [
        '.about_us',
        '.header_page',
        '.rectangle_cta',
        '.cta_recall',
        '.blue',
        '.blue-light',
        '.card1',
        '.card2',
        '.card3'
    ];
    
    return darkElements.some(selector => element.closest(selector));
}

// Update mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Check if cursor is over a dark element
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    if (elementUnderCursor && isDarkBackground(elementUnderCursor)) {
        cursorCircle.classList.add('dark');
    } else {
        cursorCircle.classList.remove('dark');
    }
});

// Smooth animation loop
function animate() {
    // Calculate the distance between mouse and circle
    const dx = mouseX - circleX;
    const dy = mouseY - circleY;
    
    // Move circle towards mouse with easing
    circleX += dx * 0.2;
    circleY += dy * 0.2;
    
    // Update circle position
    cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    
    requestAnimationFrame(animate);
}

animate();

// Hide cursor circle when hovering over clickable elements
const clickableElements = document.querySelectorAll('a, button, [role="button"], .header_element, .project_button');
clickableElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursorCircle.style.display = 'none';
    });
    element.addEventListener('mouseleave', () => {
        cursorCircle.style.display = 'block';
    });
});

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Header button functionality
const headerButton = document.querySelector('.header_button');
const headerPage = document.querySelector('.header_page');
const headerPageClose = document.querySelector('.header_page_close');
const logo = document.querySelector('.logo');
const topLogo = document.querySelector('.top_logo');

// Add hover effect to logos
if (logo) {
  logo.style.transition = 'transform 0.3s ease';
  logo.addEventListener('mouseover', () => {
    logo.style.transform = 'scale(1.05)';
  });
  logo.addEventListener('mouseout', () => {
    logo.style.transform = 'scale(1)';
  });
}

if (topLogo) {
  topLogo.style.transition = 'transform 0.3s ease';
  topLogo.addEventListener('mouseover', () => {
    topLogo.style.transform = 'scale(1.05)';
  });
  topLogo.addEventListener('mouseout', () => {
    topLogo.style.transform = 'scale(1)';
  });
}

// Add click handlers for logos
if (logo) {
  logo.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

if (topLogo) {
  topLogo.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

headerButton.addEventListener('click', () => {
  headerPage.classList.add('active');
});

headerPageClose.addEventListener('click', () => {
  headerPage.classList.remove('active');
});

// Smooth scroll function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    lenis.scrollTo(section, {
      offset: 0,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    headerPage.classList.remove('active');
  } else {
    // If section doesn't exist on current page, redirect to home page and scroll
    window.location.href = `index.html#${sectionId}`;
  }
}

// Add click event listeners for all header elements
document.addEventListener('DOMContentLoaded', () => {
  // Home button
  const homeButton = document.querySelector('.header_home');
  if (homeButton) {
    homeButton.addEventListener('click', () => {
      if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        scrollToSection('home');
      } else {
        window.location.href = 'index.html#home';
      }
    });
  }

  // About Freelynk button
  const aboutButton = document.querySelector('.header_about_freelynk');
  if (aboutButton) {
    aboutButton.addEventListener('click', () => {
      if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        scrollToSection('about');
      } else {
        window.location.href = 'index.html#about';
      }
    });
  }

  // How It Works button
  const howItWorksButton = document.querySelector('.header_how_it_works');
  if (howItWorksButton) {
    howItWorksButton.addEventListener('click', () => {
      if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        scrollToSection('how-it-works');
      } else {
        window.location.href = 'index.html#how-it-works';
      }
    });
  }

  // Browse Projects button
  const browseProjectsButton = document.querySelector('.header_browse_projects');
  if (browseProjectsButton) {
    browseProjectsButton.addEventListener('click', () => {
      window.location.href = 'projects.html';
      headerPage.classList.remove('active');
    });
  }

  // Login button
  const loginButton = document.querySelector('.header_login');
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      window.location.href = 'login.html';
      headerPage.classList.remove('active');
    });
  }

  // Sign Up button
  const signupButton = document.querySelector('.header_signup');
  if (signupButton) {
    signupButton.addEventListener('click', () => {
      window.location.href = 'signup.html';
      headerPage.classList.remove('active');
    });
  }
});

// Signup functionality
document.addEventListener('DOMContentLoaded', () => {
    const signupButton = document.querySelector('.signup_button');
    const roleOptions = document.querySelectorAll('.role_option');
    let selectedRole = null;

    if (roleOptions.length > 0) {
        roleOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                roleOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Store selected role
                selectedRole = option.classList.contains('freelancer') ? 'freelancer' : 'employer';
            });
        });
    }

    if (signupButton) {
        signupButton.addEventListener('click', () => {
            const fullName = document.getElementById('full_name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const reEnterPassword = document.getElementById('re_enter_password').value;

            // Validate form
            if (!fullName || !email || !password || !reEnterPassword || !selectedRole) {
                alert('Please fill in all fields and select a role');
                return;
            }

            if (password !== reEnterPassword) {
                alert('Passwords do not match');
                return;
            }

            // Create user object
            const userData = {
                fullName,
                email,
                role: selectedRole,
                isLoggedIn: true
            };

            // Save user data to localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));

            // Redirect based on role
            if (selectedRole === 'freelancer') {
                window.location.href = 'projects.html';
            } else {
                window.location.href = 'upload.html';
            }
        });
    }

    // Check if user is logged in and update UI accordingly
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.isLoggedIn) {
        // Update header elements based on user role
        const headerElements = document.querySelectorAll('.header_element');
        headerElements.forEach(element => {
            if (element.classList.contains('header_login')) {
                element.textContent = '👤 ' + currentUser.fullName;
            }
            if (element.classList.contains('header_signup')) {
                element.textContent = '🚪 Logout';
                element.addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                });
            }
        });

        // Show/hide elements based on role
        if (currentUser.role === 'employer') {
            const browseProjectsElement = document.querySelector('.header_browse_projects');
            if (browseProjectsElement) {
                browseProjectsElement.textContent = '📝 Post Project';
                browseProjectsElement.addEventListener('click', () => {
                    window.location.href = 'upload.html';
                });
            }
        }
    }
});

// Project Apply Now button functionality
document.addEventListener('DOMContentLoaded', () => {
    const applyButtons = document.querySelectorAll('.project_button');
    
    applyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected class from all buttons
            applyButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            button.classList.add('selected');
            
            // You can add additional functionality here, like:
            // - Opening an application form
            // - Showing a confirmation message
            // - Sending an application request to the server
        });
    });
});

// Authentication check function
function checkAuth(action) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isLoggedIn) {
        alert('Please sign up to ' + action);
        window.location.href = 'signup.html';
        return false;
    }
    return true;
}

// Project Management Functionality
document.addEventListener('DOMContentLoaded', () => {
    const submitProjectButton = document.getElementById('submitProject');
    const deleteProjectButton = document.getElementById('deleteProject');
    
    if (submitProjectButton) {
        submitProjectButton.addEventListener('click', () => {
            // Check if user is logged in and is an employer
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!checkAuth('upload a project')) return;
            
            if (currentUser.role !== 'employer') {
                alert('Only employers can upload projects. Please sign up as an employer.');
                window.location.href = 'signup.html';
                return;
            }

            const projectData = {
                title: document.getElementById('projectTitle').value,
                description: document.getElementById('projectDescription').value,
                company: document.getElementById('companyName').value,
                budget: document.getElementById('projectBudget').value,
                timeline: document.getElementById('projectTimeline').value,
                id: Date.now(), // Unique ID for the project
                employerId: currentUser.email // Store employer's email with the project
            };
            
            // Validate form
            if (!projectData.title || !projectData.description || !projectData.company || 
                !projectData.budget || !projectData.timeline) {
                alert('Please fill in all fields');
                return;
            }
            
            // Get existing projects or initialize empty array
            let projects = JSON.parse(localStorage.getItem('projects') || '[]');
            
            // Add new project
            projects.push(projectData);
            
            // Save to localStorage
            localStorage.setItem('projects', JSON.stringify(projects));
            
            // Clear form
            clearProjectForm();
            
            // Redirect to projects page
            window.location.href = 'projects.html';
        });
    }
    
    if (deleteProjectButton) {
        deleteProjectButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this project?')) {
                clearProjectForm();
            }
        });
    }
    
    // Function to clear form
    function clearProjectForm() {
        document.getElementById('projectTitle').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('companyName').value = '';
        document.getElementById('projectBudget').value = '';
        document.getElementById('projectTimeline').value = '';
    }
    
    // Load projects on projects.html
    const projectsGrid = document.querySelector('.projects_grid');
    if (projectsGrid) {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Get projects from localStorage
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        
        // Get applied projects for current user
        const appliedProjects = JSON.parse(localStorage.getItem('appliedProjects') || '[]');
        
        // Clear existing projects
        projectsGrid.innerHTML = '';
        
        // Add each project to the grid
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project_card';
            
            // Check if user is logged in and is an employer
            const isEmployer = currentUser && currentUser.role === 'employer';
            const isProjectOwner = currentUser && project.employerId === currentUser.email;
            const hasApplied = currentUser && appliedProjects.includes(project.id);
            
            // Create project card content
            let cardContent = `
                <div class="project_title">${project.title}</div>
                <div class="project_description">${project.description}</div>
                <div class="project_details">
                    <div class="employer_name">Posted by: ${project.company}</div>
                    <div class="project_budget">Budget: ${project.budget}</div>
                    <div class="project_timeline">Timeline: ${project.timeline}</div>
                </div>
                <div class="project_actions">
            `;

            // Add appropriate buttons based on user role and project ownership
            if (isEmployer && isProjectOwner) {
                // Only show delete button to the project owner
                cardContent += `
                    <button class="delete_project_card" data-project-id="${project.id}">Delete</button>
                `;
            } else if (!isEmployer) {
                // Show apply/applied button to freelancers
                const buttonClass = hasApplied ? 'project_button applied' : 'project_button';
                const buttonText = hasApplied ? 'Applied' : 'Apply Now';
                cardContent += `
                    <div class="${buttonClass}" data-project-id="${project.id}">${buttonText}</div>
                `;
            }

            cardContent += `</div>`;
            projectCard.innerHTML = cardContent;
            projectsGrid.appendChild(projectCard);
        });
        
        // Add click handlers for Apply Now buttons (only for freelancers)
        const applyButtons = document.querySelectorAll('.project_button:not(.applied)');
        applyButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!checkAuth('apply for this project')) return;
                
                const projectId = button.dataset.projectId;
                
                // Get current applied projects
                let appliedProjects = JSON.parse(localStorage.getItem('appliedProjects') || '[]');
                
                // Add project to applied projects
                if (!appliedProjects.includes(projectId)) {
                    appliedProjects.push(projectId);
                    localStorage.setItem('appliedProjects', JSON.stringify(appliedProjects));
                    
                    // Update button appearance
                    button.classList.add('applied');
                    button.textContent = 'Applied';
                    
                    // Show confirmation message
                    alert('Successfully applied for the project!');
                }
            });
        });

        // Add click handlers for Delete buttons (only for employers)
        const deleteButtons = document.querySelectorAll('.delete_project_card');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!checkAuth('delete this project')) return;
                
                if (confirm('Are you sure you want to delete this project?')) {
                    const projectId = button.dataset.projectId;
                    
                    // Get current projects
                    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
                    
                    // Remove the project
                    projects = projects.filter(project => project.id != projectId);
                    
                    // Save updated projects
                    localStorage.setItem('projects', JSON.stringify(projects));
                    
                    // Remove the card from DOM
                    button.closest('.project_card').remove();
                }
            });
        });
    }
});