/**
 * JATIN YADAV - PORTFOLIO INTERACTION LOGIC
 * Synchronized with Resume Content: Wonderlust, Course Connect, SAP ABAP
 * Features: Dark/Light Mode, Filter Tabs, Interactive Modals, 
 * Form Validation, Animated Skill Bars, Toast Feedback, and Smooth Scrolling.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. THEME SWITCHER (Dark / Light Mode)
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or default to light
  const storedTheme = localStorage.getItem('jy_portfolio_theme') || 'light';
  setTheme(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('jy_portfolio_theme', theme);
  }

  // =========================================================================
  // 2. STICKY NAVBAR & SCROLLSPY
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar blur background elevation
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 380) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scrollspy active state
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 3. MOBILE MENU TOGGLE
  // =========================================================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && 
          !mobileDrawer.contains(e.target) && 
          !mobileMenuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }

  // =========================================================================
  // 4. ANIMATED SKILLS PROGRESS BARS (INTERSECTION OBSERVER)
  // =========================================================================
  const skillCards = document.querySelectorAll('.skill-card');

  if ('IntersectionObserver' in window && skillCards.length > 0) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    skillCards.forEach(card => skillObserver.observe(card));
  } else {
    skillCards.forEach(card => card.classList.add('animated'));
  }

  // =========================================================================
  // 5. SKILLS FILTER TABS
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterValue = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.classList.add('animated');
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 6. PROJECTS FILTER TABS
  // =========================================================================
  const projectTabs = document.querySelectorAll('.project-tab');
  const projectCards = document.querySelectorAll('.project-card');

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      projectCards.forEach(card => {
        const projectCat = card.getAttribute('data-category');
        if (category === 'all' || projectCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 7. PROJECT DETAILS MODAL (Exact Resume Details)
  // =========================================================================
  const projectData = {
    wonderlust: {
      title: "Wonderlust – Property Rental Web Application",
      category: "Full-Stack Web App (Node.js, Express, MongoDB, EJS, Bootstrap)",
      status: "Repository: github.com/jatin-yadav0/MejoreProject",
      description: "Wonderlust is a comprehensive full-stack property rental web application inspired by Airbnb. It features end-to-end CRUD functionality for property listings, session-based authentication via Passport.js, integrated image hosting with Cloudinary, and dynamic review systems.",
      features: [
        "Developed full-stack property rental web application with complete CRUD functionality for property listings.",
        "Implemented secure user authentication and authorization using Passport.js with session-based login and signup.",
        "Integrated Cloudinary for cloud image upload and storage, allowing users to upload and manage listing photos right from their browser.",
        "Engineered advanced search and filter capabilities to quickly browse properties by geographical location and category.",
        "Built responsive, aesthetic UI using Bootstrap and EJS server-rendered templates with custom modern styling.",
        "Designed review and rating functionality, allowing authenticated guests to submit feedback and ratings for listed properties.",
        "Managed backend routing, database operations, error handling middleware, and dynamic rendering using Express.js and MongoDB."
      ],
      techStack: ["Node.js", "Express.js", "MongoDB", "Mongoose", "EJS", "Bootstrap", "Cloudinary API", "Passport.js", "MVC Pattern"],
      githubUrl: "https://github.com/jatin-yadav0/MejoreProject"
    },
    course_connect: {
      title: "Course Connect – Online Course Management System",
      category: "Java Web Application (Java, JSP, Servlets, JDBC, MySQL, Bootstrap)",
      status: "GitHub: github.com/jatin-yadav0",
      description: "Course Connect is a dynamic Online Course Management System that streamlines course discovery, student registration, enrollment tracking, and curriculum management through standard enterprise Java web patterns.",
      features: [
        "Developed dynamic Online Course Management System that allows users to browse, enroll, and manage online courses efficiently.",
        "Implemented clean MVC architecture using Servlets as Controllers, JSP for Views, and DAO/DTO design patterns for backend data handling.",
        "Integrated MySQL database connectivity using JDBC to perform secure CRUD operations for users, courses, and enrollments.",
        "Designed secure user authentication and input validation system for registration and login workflows.",
        "Built a responsive and user-friendly interface using Bootstrap, HTML, and CSS for seamless access across desktop and mobile devices.",
        "Developed course enrollment and dashboard features, enabling users to track enrolled courses and manage learning activities.",
        "Managed backend business logic, database queries, and dynamic content rendering using Java Servlets and JSP technology."
      ],
      techStack: ["Java Core", "JSP (JavaServer Pages)", "Java Servlets", "JDBC", "MySQL", "MVC Architecture", "DAO/DTO Patterns", "Bootstrap"],
      githubUrl: "https://github.com/jatin-yadav0"
    },
    sap_abap: {
      title: "SAP ABAP – DDIC Objects, ALV Reports & Open SQL",
      category: "Enterprise SAP Exploration",
      status: "Certified & Active Practical Learning",
      description: "Deep hands-on exploration of SAP enterprise development and procedural ABAP programming on SAP NetWeaver / SAP GUI environment.",
      features: [
        "Proficient with SAP ABAP Data Dictionary (DDIC) objects: Database Tables (MARA, MARC, VBAK), Views, Data Elements, Domains, Structures, and Table Maintenance Generators (TMG).",
        "Formulated Open SQL queries (SELECT, INNER JOIN, FOR ALL ENTRIES) for optimal data retrieval from relational SAP tables.",
        "Developed Classical, Interactive, and ALV Grid Reports with custom selection screens, variants, and search helps.",
        "Practical understanding of Batch Data Communication (BDC) and Business Application Programming Interfaces (BAPI) integration.",
        "Proficient in SAP GUI Debugging (breakpoints, watchpoints, call stacks) to analyze runtime behaviors and optimize program execution."
      ],
      techStack: ["Core ABAP", "DDIC Objects", "ALV Grid", "Open SQL", "BDC", "BAPI Integration", "SAP GUI Debugger"],
      githubUrl: "https://github.com/jatin-yadav0"
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectModalBody = document.getElementById('project-modal-body');
  const closeProjectModalBtn = document.getElementById('close-project-modal');
  const modalProjectCloseBtn = document.getElementById('modal-project-close');
  const modalProjectGithub = document.getElementById('modal-project-github');
  const previewModalTriggers = document.querySelectorAll('.preview-modal-trigger');

  previewModalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];
      if (!data) return;

      projectModalTitle.textContent = data.title;
      if (modalProjectGithub) {
        modalProjectGithub.href = data.githubUrl;
      }

      projectModalBody.innerHTML = `
        <div style="margin-bottom: 18px;">
          <span class="pill-badge pill-blue" style="margin-bottom: 8px;">${data.category}</span>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 8px; line-height: 1.6;">${data.description}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 1.05rem; margin-bottom: 10px; color: var(--heading-color);">Key Implementation Highlights:</h4>
          <ul style="padding-left: 20px; color: var(--text-muted); font-size: 0.92rem; line-height: 1.7;">
            ${data.features.map(f => `<li style="margin-bottom: 6px;">${f}</li>`).join('')}
          </ul>
        </div>

        <div>
          <h4 style="font-size: 1.05rem; margin-bottom: 10px; color: var(--heading-color);">Tech Stack & Tools:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${data.techStack.map(t => `<span class="tech-tag" style="background: var(--bg-secondary); color: var(--heading-color);">${t}</span>`).join('')}
          </div>
        </div>
      `;

      openModal(projectModal);
    });
  });

  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', () => closeModal(projectModal));
  if (modalProjectCloseBtn) modalProjectCloseBtn.addEventListener('click', () => closeModal(projectModal));

  // =========================================================================
  // 8. RESUME MODAL & PRINT/DOWNLOAD
  // =========================================================================
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const btnHeroCv = document.getElementById('btn-hero-cv');
  const closeResumeModalBtn = document.getElementById('close-resume-modal');
  const modalCloseAction = document.getElementById('modal-close-action');
  const modalPrintBtn = document.getElementById('modal-print-btn');

  if (openResumeBtn) openResumeBtn.addEventListener('click', () => openModal(resumeModal));
  if (btnHeroCv) btnHeroCv.addEventListener('click', () => openModal(resumeModal));
  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', () => closeModal(resumeModal));
  if (modalCloseAction) modalCloseAction.addEventListener('click', () => closeModal(resumeModal));

  if (modalPrintBtn) {
    modalPrintBtn.addEventListener('click', () => {
      showToast('Opening print dialog for Jatin Yadav CV...', 'info');
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }

  // Modal helper functions
  function openModal(modalElement) {
    if (!modalElement) return;
    modalElement.style.display = 'flex';
    void modalElement.offsetWidth;
    modalElement.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove('open');
    setTimeout(() => {
      modalElement.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  [projectModal, resumeModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('open')) closeModal(projectModal);
      if (resumeModal && resumeModal.classList.contains('open')) closeModal(resumeModal);
    }
  });

  // =========================================================================
  // 9. COPY EMAIL TO CLIPBOARD (User's Exact Email)
  // =========================================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailText = "jatiny.yadav8@gmail.com";

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailText).then(() => {
          showToast(`Copied ${emailText} to clipboard!`, 'success');
        }).catch(() => {
          fallbackCopyText(emailText);
        });
      } else {
        fallbackCopyText(emailText);
      }
    });
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`, 'success');
    } catch (err) {
      showToast('Could not copy email automatically.', 'warning');
    }
    document.body.removeChild(tempInput);
  }

  // =========================================================================
  // 10. CONTACT FORM VALIDATION & SUBMISSION
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formSuccessBanner = document.getElementById('form-success-banner');
  const formErrorBanner = document.getElementById('form-error-banner');
  const formSuccessTitle = document.getElementById('form-success-title');
  const formSuccessDesc = document.getElementById('form-success-desc');
  const formErrorTitle = document.getElementById('form-error-title');
  const formErrorDesc = document.getElementById('form-error-desc');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('user_name');
      const emailInput = document.getElementById('user_email');
      const subjectInput = document.getElementById('user_subject');
      const messageInput = document.getElementById('user_message');

      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const messageError = document.getElementById('message-error');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.classList.add('is-invalid');
        nameError.classList.add('visible');
        isValid = false;
      } else {
        nameInput.classList.remove('is-invalid');
        nameError.classList.remove('visible');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        emailError.classList.add('visible');
        isValid = false;
      } else {
        emailInput.classList.remove('is-invalid');
        emailError.classList.remove('visible');
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageInput.classList.add('is-invalid');
        messageError.classList.add('visible');
        isValid = false;
      } else {
        messageInput.classList.remove('is-invalid');
        messageError.classList.remove('visible');
      }

      if (!isValid) {
        showToast('Please fix the highlighted fields in the form.', 'warning');
        return;
      }

      // Reset banners
      if (formSuccessBanner) formSuccessBanner.style.display = 'none';
      if (formErrorBanner) formErrorBanner.style.display = 'none';

      // Sending state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnIcon = submitBtn.querySelector('.btn-icon');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      btnText.style.display = 'none';
      btnIcon.style.display = 'none';
      btnSpinner.style.display = 'inline-flex';
      submitBtn.disabled = true;

      const recipientEmail = 'jatiny.yadav8@gmail.com';
      const senderName = nameInput.value.trim();
      const senderEmail = emailInput.value.trim();
      const rawSubject = subjectInput ? subjectInput.value.trim() : '';
      const senderSubject = rawSubject || 'New Portfolio Message';
      const senderMessage = messageInput.value.trim();

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: senderName,
            email: senderEmail,
            subject: senderSubject,
            _subject: `Portfolio Message from ${senderName}: ${senderSubject}`,
            message: senderMessage,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true)) {
          contactForm.reset();
          if (formSuccessBanner) {
            if (formSuccessTitle) formSuccessTitle.textContent = 'Thank you! Your message has been sent successfully.';
            if (formSuccessDesc) formSuccessDesc.textContent = 'I have received your message and will get back to you promptly.';
            formSuccessBanner.style.display = 'flex';
            setTimeout(() => {
              formSuccessBanner.style.display = 'none';
            }, 9000);
          }
          showToast('Message sent! Jatin will get back to you soon.', 'success');
        } else if (data.message && data.message.toLowerCase().includes('activation')) {
          if (formSuccessBanner) {
            if (formSuccessTitle) formSuccessTitle.textContent = 'One-time setup required!';
            if (formSuccessDesc) formSuccessDesc.textContent = "FormSubmit sent an activation email to jatiny.yadav8@gmail.com. Please check your Gmail and click 'Activate Form' once.";
            formSuccessBanner.style.display = 'flex';
          }
          showToast('Please check your Gmail inbox to click the one-time activation link.', 'warning');
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
        if (formErrorBanner) {
          if (formErrorTitle) formErrorTitle.textContent = 'Could not send message automatically.';
          if (formErrorDesc) {
            formErrorDesc.innerHTML = `Please email directly at <a href="mailto:${recipientEmail}" class="fallback-mail-link">${recipientEmail}</a>`;
          }
          formErrorBanner.style.display = 'flex';
        }
        showToast('Message sending failed. Please email jatiny.yadav8@gmail.com directly.', 'warning');
      } finally {
        btnText.style.display = '';
        btnIcon.style.display = '';
        btnSpinner.style.display = 'none';
        submitBtn.disabled = false;
      }
    });

    ['user_name', 'user_email', 'user_message'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
          const err = document.getElementById(id === 'user_name' ? 'name-error' : id === 'user_email' ? 'email-error' : 'message-error');
          if (err) err.classList.remove('visible');
        });
      }
    });
  }

  // =========================================================================
  // 11. TOAST NOTIFICATION UTILITY
  // =========================================================================
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 4000);
  }

  // =========================================================================
  // 12. DYNAMIC YEAR
  // =========================================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});
