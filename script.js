document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
    }, 2000);
});
document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'A' || 
        (target.classList && 
         (target.classList.contains('header_element') || 
          target.classList.contains('project_button')))) {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.classList.remove('fade-out');
        const progress = loadingScreen.querySelector('.loading-progress');
        progress.style.animation = 'none';
        progress.offsetHeight;
        progress.style.animation = 'loading 2s ease-in-out forwards';
    }
});
const cursorCircle = document.querySelector('.cursor-circle');
let mouseX = 0;
let mouseY = 0;
let circleX = 0;
let circleY = 0;
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
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    if (elementUnderCursor && isDarkBackground(elementUnderCursor)) {
        cursorCircle.classList.add('dark');
    } else {
        cursorCircle.classList.remove('dark');
    }
});
function animate() {
    const dx = mouseX - circleX;
    const dy = mouseY - circleY;
    circleX += dx * 0.2;
    circleY += dy * 0.2;
    cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    
    requestAnimationFrame(animate);
}

animate();
const clickableElements = document.querySelectorAll('a, button, [role="button"], .header_element, .project_button');
clickableElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursorCircle.style.display = 'none';
    });
    element.addEventListener('mouseleave', () => {
        cursorCircle.style.display = 'block';
    });
});

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

const headerButton = document.querySelector('.header_button');
const headerPage = document.querySelector('.header_page');
const headerPageClose = document.querySelector('.header_page_close');
const logo = document.querySelector('.logo');
const topLogo = document.querySelector('.top_logo');

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
    window.location.href = `index.html#${sectionId}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
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

  const browseProjectsButton = document.querySelector('.header_browse_projects');
  if (browseProjectsButton) {
    browseProjectsButton.addEventListener('click', () => {
      window.location.href = 'projects.html';
      headerPage.classList.remove('active');
    });
  }

  const loginButton = document.querySelector('.header_login');
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      window.location.href = 'login.html';
      headerPage.classList.remove('active');
    });
  }

  const signupButton = document.querySelector('.header_signup');
  if (signupButton) {
    signupButton.addEventListener('click', () => {
      window.location.href = 'signup.html';
      headerPage.classList.remove('active');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const signupButton = document.querySelector('.signup_button');
    const roleOptions = document.querySelectorAll('.role_option');
    let selectedRole = null;

    if (roleOptions.length > 0) {
        roleOptions.forEach(option => {
            option.addEventListener('click', () => {
                roleOptions.forEach(opt => opt.classList.remove('selected'));
                
                option.classList.add('selected');
                
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
            if (!fullName || !email || !password || !reEnterPassword || !selectedRole) {
                alert('Please fill in all fields and select a role');
                return;
            }

            if (password !== reEnterPassword) {
                alert('Passwords do not match');
                return;
            }

            const userData = {
                fullName,
                email,
                role: selectedRole,
                isLoggedIn: true
            };

            localStorage.setItem('currentUser', JSON.stringify(userData));

            if (selectedRole === 'freelancer') {
                window.location.href = 'projects.html';
            } else {
                window.location.href = 'upload.html';
            }
        });
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.isLoggedIn) {
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

document.addEventListener('DOMContentLoaded', () => {
    const applyButtons = document.querySelectorAll('.project_button'); 
    applyButtons.forEach(button => {
        button.addEventListener('click', () => {
            applyButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });
});

function checkAuth(action) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isLoggedIn) {
        alert('Please sign up to ' + action);
        window.location.href = 'signup.html';
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const submitProjectButton = document.getElementById('submitProject');
    const deleteProjectButton = document.getElementById('deleteProject');
    
    if (submitProjectButton) {
        submitProjectButton.addEventListener('click', () => {
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
                id: Date.now(), 
                employerId: currentUser.email 
            };
            
            if (!projectData.title || !projectData.description || !projectData.company || 
                !projectData.budget || !projectData.timeline) {
                alert('Please fill in all fields');
                return;
            }
            
            let projects = JSON.parse(localStorage.getItem('projects') || '[]');
            
            projects.push(projectData);
            
            localStorage.setItem('projects', JSON.stringify(projects));
            
            clearProjectForm();
            
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
    
    function clearProjectForm() {
        document.getElementById('projectTitle').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('companyName').value = '';
        document.getElementById('projectBudget').value = '';
        document.getElementById('projectTimeline').value = '';
    }
    
    const projectsGrid = document.querySelector('.projects_grid');
    if (projectsGrid) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        
        const appliedProjects = JSON.parse(localStorage.getItem('appliedProjects') || '[]');
        
        projectsGrid.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project_card';
            
            const isEmployer = currentUser && currentUser.role === 'employer';
            const isProjectOwner = currentUser && project.employerId === currentUser.email;
            const hasApplied = currentUser && appliedProjects.includes(project.id);
            
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

            if (isEmployer && isProjectOwner) {
                // Only show delete button to the project owner
                cardContent += `
                    <button class="delete_project_card" data-project-id="${project.id}">Delete</button>
                `;
            } else if (!isEmployer) {
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
        
        const applyButtons = document.querySelectorAll('.project_button:not(.applied)');
        applyButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!checkAuth('apply for this project')) return;
                
                const projectId = button.dataset.projectId;
                
                let appliedProjects = JSON.parse(localStorage.getItem('appliedProjects') || '[]');
                
                if (!appliedProjects.includes(projectId)) {
                    appliedProjects.push(projectId);
                    localStorage.setItem('appliedProjects', JSON.stringify(appliedProjects));
                    button.classList.add('applied');
                    button.textContent = 'Applied';
                    alert('Successfully applied for the project!');
                }
            });
        });
        const deleteButtons = document.querySelectorAll('.delete_project_card');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!checkAuth('delete this project')) return;
                if (confirm('Are you sure you want to delete this project?')) {
                    const projectId = button.dataset.projectId;
                    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
                    projects = projects.filter(project => project.id != projectId);
                    localStorage.setItem('projects', JSON.stringify(projects));
                    button.closest('.project_card').remove();
                }
            });
        });
    }
});