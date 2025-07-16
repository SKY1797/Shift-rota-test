// Date utilities (simplified date-fns functions)
const DateUtils = {
  // Format date to month/year string
  formatMonthYear: (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  },

  // Format date to day number
  formatDay: (date) => {
    return date.getDate();
  },

  // Add months to date
  addMonths: (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },

  // Subtract months from date
  subMonths: (date, months) => {
    return DateUtils.addMonths(date, -months);
  },

  // Get first day of month
  startOfMonth: (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  // Get last day of month
  endOfMonth: (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  },

  // Get start of week (Sunday)
  startOfWeek: (date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day;
    return new Date(result.setDate(diff));
  },

  // Get end of week (Saturday)
  endOfWeek: (date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() + (6 - day);
    return new Date(result.setDate(diff));
  },

  // Check if dates are in same month
  isSameMonth: (date1, date2) => {
    return (
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  },

  // Check if date is today
  isToday: (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  // Get array of dates in interval
  eachDayOfInterval: (start, end) => {
    const dates = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  },

  // Calculate difference in calendar days
  differenceInCalendarDays: (date1, date2) => {
    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate(),
    );
    return Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
  },

  // Get day of week (0 = Sunday)
  getDay: (date) => {
    return date.getDay();
  },
};

// Shift Logic
const ShiftLogic = {
  // Shift types and data
  SHIFT_TYPES: {
    MORNING: "MORNING",
    EVENING: "EVENING",
    NIGHT: "NIGHT",
    WEEKLY_OFF: "WEEKLY_OFF",
    GENERAL: "GENERAL",
  },

  // The 8-day repeating shift cycle
  SHIFT_CYCLE: [
    { name: "B1", type: "EVENING" }, // 0
    { name: "B2", type: "EVENING" }, // 1
    { name: "C1", type: "NIGHT" }, // 2
    { name: "C2", type: "NIGHT" }, // 3
    { name: "O", type: "WEEKLY_OFF" }, // 4
    { name: "G", type: "GENERAL" }, // 5
    { name: "A1", type: "MORNING" }, // 6
    { name: "A2", type: "MORNING" }, // 7
  ],

  // Fixed reference date
  REFERENCE_DATE: new Date("2025-06-27T00:00:00Z"),

  // Reference shift indices for each group
  REFERENCE_SHIFT_INDICES: {
    A: 2, // Group A starts with Night Shift
    B: 4, // Group B starts with Weekly Off
    C: 6, // Group C starts with Morning Shift
    D: 0, // Group D starts with Evening Shift
  },

  // Get shift for specific date and group
  getShiftForDate: (date, group) => {
    const daysDifference = DateUtils.differenceInCalendarDays(
      date,
      ShiftLogic.REFERENCE_DATE,
    );
    const referenceShiftIndex = ShiftLogic.REFERENCE_SHIFT_INDICES[group];

    // Calculate the index in the cycle
    const cycleIndex =
      (referenceShiftIndex + daysDifference) % ShiftLogic.SHIFT_CYCLE.length;
    const positiveCycleIndex =
      (cycleIndex + ShiftLogic.SHIFT_CYCLE.length) %
      ShiftLogic.SHIFT_CYCLE.length;

    let calculatedShift = ShiftLogic.SHIFT_CYCLE[positiveCycleIndex];

    // Special rule: If a General Shift falls on a Sunday, replace with Weekly Off
    if (calculatedShift.type === "GENERAL" && DateUtils.getDay(date) === 0) {
      return { name: "O", type: "WEEKLY_OFF" };
    }

    return calculatedShift;
  },
};

// Icon SVGs
const Icons = {
  Sun: `<svg class="shift-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="m12 2 0 2"/>
        <path d="m12 20 0 2"/>
        <path d="m4.93 4.93 1.41 1.41"/>
        <path d="m17.66 17.66 1.41 1.41"/>
        <path d="m2 12 2 0"/>
        <path d="m20 12 2 0"/>
        <path d="m6.34 17.66-1.41 1.41"/>
        <path d="m19.07 4.93-1.41 1.41"/>
    </svg>`,

  Sunset: `<svg class="shift-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 10V2"/>
	<path d="m4.93 10.93 1.41 1.41"/>
	<path d="M2 18h2"/>
	<path d="M20 18h2"/>
	<path d="m19.07 10.93-1.41 1.41"/>
	<path d="M22 22H2"/>
	<path d="m16 6-4 4-4-4"/>
	<path d="M16 18a4 4 0 0 0-8 0"/>
    </svg>`,

  Moon: `<svg class="shift-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>`,

  Coffee: `<svg class="shift-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 2v2"/>
	<path d="M14 2v2"/>
	<path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>
	<path d="M6 2v2"/>
    </svg>`,

  Briefcase: `<svg class="shift-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        <rect width="20" height="14" x="2" y="6" rx="2"/>
    </svg>`,
};

// Page Navigation
class PageManager {
  constructor() {
    this.currentPage = "home";
    this.selectedGroup = null;
    this.homePage = document.getElementById("home-page");
    this.calendarPage = document.getElementById("calendar-page");

    // Ensure proper initial state
    this.homePage.classList.remove("hidden");
    this.calendarPage.classList.add("hidden");

    this.setupEventListeners();
    this.showHomePage();
  }

  setupEventListeners() {
    // Group selection buttons
    const groupButtons = document.querySelectorAll(".group-button");
    groupButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const group = e.currentTarget.dataset.group;
        this.selectGroup(group);
      });
    });

    // Back button
    const backButton = document.getElementById("back-button");
    if (backButton) {
      backButton.addEventListener("click", () => {
        this.showHomePage();
      });
    }
  }

  selectGroup(group) {
    this.selectedGroup = group;
    this.showCalendarPage();
  }

  showHomePage() {
    this.currentPage = "home";
    this.homePage.classList.add("active");
    this.homePage.classList.remove("hidden");
    this.calendarPage.classList.remove("active");
    this.calendarPage.classList.add("hidden");
  }

  showCalendarPage() {
    this.currentPage = "calendar";
    this.homePage.classList.remove("active");
    this.homePage.classList.add("hidden");
    this.calendarPage.classList.add("active");
    this.calendarPage.classList.remove("hidden");

    // Update the selected group title
    const groupTitle = document.getElementById("selected-group-title");
    if (groupTitle) {
      groupTitle.textContent = `Group ${this.selectedGroup}`;
    }

    // Initialize calendar if not already done
    if (!window.calendarApp) {
      window.calendarApp = new CalendarApp(this.selectedGroup);
    } else {
      window.calendarApp.selectGroup(this.selectedGroup);
    }
  }
}

// Calendar App
class CalendarApp {
  constructor(initialGroup = "A") {
    this.currentDate = new Date();
    this.selectedGroup = initialGroup;
    this.isInitialized = false;

    this.initializeElements();
    this.setupEventListeners();
    this.render();
  }

  initializeElements() {
    this.calendarTitle = document.getElementById("calendar-title");
    this.calendarGrid = document.getElementById("calendar-grid");
    this.prevButton = document.getElementById("prev-month");
    this.nextButton = document.getElementById("next-month");
    this.groupTabs = document.querySelectorAll(".group-tab");
  }

  setupEventListeners() {
    // Navigation buttons
    this.prevButton.addEventListener("click", () => {
      this.currentDate = DateUtils.subMonths(this.currentDate, 1);
      this.render();
    });

    this.nextButton.addEventListener("click", () => {
      this.currentDate = DateUtils.addMonths(this.currentDate, 1);
      this.render();
    });

    // Group tabs
    this.groupTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const group = tab.dataset.group;
        this.selectGroup(group);
      });
    });
  }

  selectGroup(group) {
    this.selectedGroup = group;

    // Update active tab
    this.groupTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.group === group);
    });

    this.render();
  }

  getCalendarDays() {
    const firstDayOfMonth = DateUtils.startOfMonth(this.currentDate);
    const lastDayOfMonth = DateUtils.endOfMonth(this.currentDate);
    const startDate = DateUtils.startOfWeek(firstDayOfMonth);
    const endDate = DateUtils.endOfWeek(lastDayOfMonth);

    return DateUtils.eachDayOfInterval(startDate, endDate);
  }

  getShiftIcon(shiftType) {
    const iconMap = {
      MORNING: Icons.Sun,
      EVENING: Icons.Sunset,
      NIGHT: Icons.Moon,
      WEEKLY_OFF: Icons.Coffee,
      GENERAL: Icons.Briefcase,
    };

    return iconMap[shiftType] || "";
  }

  createDayCard(day) {
    const shift = ShiftLogic.getShiftForDate(day, this.selectedGroup);
    const isCurrentMonth = DateUtils.isSameMonth(day, this.currentDate);
    const isTodayFlag = DateUtils.isToday(day);

    const dayCard = document.createElement("div");
    dayCard.className = "day-card";

    // Add classes for styling
    if (!isCurrentMonth) {
      dayCard.classList.add("other-month");
    } else {
      dayCard.classList.add(
        `shift-${shift.type.toLowerCase().replace("_", "-")}`,
      );
    }

    if (isTodayFlag) {
      dayCard.classList.add("today");
    }

    dayCard.innerHTML = `
            <div class="day-number">${DateUtils.formatDay(day)}</div>
            <div class="shift-info">
                ${this.getShiftIcon(shift.type)}
                <span class="shift-name">${shift.name}</span>
            </div>
        `;

    return dayCard;
  }

  render() {
    // Update calendar title
    this.calendarTitle.textContent = DateUtils.formatMonthYear(
      this.currentDate,
    );

    // Clear calendar grid
    this.calendarGrid.innerHTML = "";

    // Get calendar days and create day cards
    const calendarDays = this.getCalendarDays();
    calendarDays.forEach((day) => {
      const dayCard = this.createDayCard(day);
      this.calendarGrid.appendChild(dayCard);
    });

    // Add fade-in animation to calendar card if first render
    if (!this.isInitialized) {
      const calendarCard = document.querySelector(".calendar-card");
      calendarCard.style.animation = "fadeIn 0.5s ease-in";
      this.isInitialized = true;
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize page manager
  window.pageManager = new PageManager();
});
