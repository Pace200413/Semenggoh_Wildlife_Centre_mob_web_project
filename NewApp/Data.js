// database.js
export const guideDatabase = {
  // Enhanced guide profiles
  users: [
    {
      id: 1,
      email: "jayden.wong@wildlife.com",
      password: "guide123",
      type: "guide",
      firstName: "Jayden",
      lastName: "Wong",
      nickname: "Jay",
      birthday: "1990-01-01",
      phone: "0123456789",
      gender: "Female",
      address: "123 Jungle Rd, Kuching, Sarawak",
      languages: ["English", "Malay", "Mandarin"],
      profilePic: require("./assets/images/propic.jpg"),
      joinDate: "2018-03-15",
      license: {
        id: "PG-2023-0425",
        issueDate: "2023-01-15",
        expirationDate: "2024-12-31",
        status: "Expired",
        level: "Senior Guide",
        feedbackScores: {
          communication: 3.2,
          knowledge: 4.0,
          safety: 4.5,
          overall: 3.8,
        },
        feedbackComments: [
          "Should improve communication skills.",
          "Good knowledge but needs clearer explanations.",
        ],
        requiredCourses: [
          {
            name: "Customer Communication",
            code: "CC104",
          },
        ],
        canRenew: true,
        isExpired: true,
        yearsActive: 5,
        photoUrl: "",
        specialty: ["Orangutan Behavior", "Night Safari"],
        certifications: [
          {
            id: "CERT-001",
            name: "Advanced Primate Handling",
            date: "2022-05-10",
            issuer: "Wildlife Dept",
          },
        ],
        courseAttempts: [
          {
            courseCode: "CC104",
            passed: true,
            attemptDate: "2024-10-01",
            feedback: "Successfully passed the course.",
          },
        ],
      },
      performance: {
        rating: 4.8,
        toursCompleted: 142,
        visitorFeedback: [
          {
            date: "2023-06-15",
            rating: 5,
            comment: "Excellent knowledge of orangutan behavior",
          },
        ],
      },
      emergencyContact: {
        name: "Lisa Wong",
        relationship: "Sister",
        phone: "0123456701",
      },
    },
    {
      id: 2,
      email: "sarah.lim@wildlife.com",
      password: "newguide123",
      type: "guide",
      firstName: "Sarah",
      lastName: "Lim",
      birthday: "1995-08-22",
      phone: "0129876543",
      gender: "Female",
      languages: ["English", "Malay"],
      profilePic: require("./assets/images/hornbill.jpg"),
      joinDate: "",
      hasLicense: false,
      trainingProgress: {
        completedCourses: [],
        pendingCourses: [],
      },
    },
    {
      id: 3,
      email: "ahmad.hassan@wildlife.com",
      password: "guide456",
      type: "guide",
      firstName: "Ahmad",
      lastName: "Hassan",
      nickname: "Mat",
      birthday: "1988-11-05",
      phone: "0123344556",
      gender: "Male",
      languages: ["English", "Malay", "Iban"],
      profilePic: require("./assets/images/cyrtandra.jpg"),
      joinDate: "2015-07-22",
      license: {
        id: "PG-2021-0187",
        issueDate: "2021-06-30",
        expirationDate: "2023-06-30",
        status: "Expired",
        level: "Master Guide",
        canRenew: true,
        isExpired: true,
        yearsActive: 8,
        specialty: ["Bird Watching", "Rainforest Ecology"],
        certifications: [
          {
            id: "CERT-045",
            name: "Avian Specialist",
            date: "2020-11-15",
            issuer: "Malaysian Ornithology Society",
          },
        ],
      },
    },
    {
      id: 4,
      email: "lin.wei@wildlife.com",
      password: "failcourse123",
      type: "guide",
      firstName: "Lin",
      lastName: "Wei",
      birthday: "1992-04-10",
      phone: "0121122334",
      gender: "Male",
      languages: ["English", "Mandarin"],
      profilePic: require("./assets/images/a.jpg"),
      joinDate: "2022-02-01",
      license: {
        id: "PG-2023-0744",
        issueDate: "2023-03-01",
        expirationDate: "2024-03-01",
        status: "Expired",
        level: "Junior Guide",
        canRenew: true,
        isExpired: true,
        yearsActive: 2,
        requiredCourses: [
          {
            name: "Basic Wildlife Guide Course",
            code: "BW101",
          },
        ],
        courseAttempts: [
          {
            courseCode: "BW101",
            passed: false,
            attemptDate: "2024-11-01",
            feedback: "Needs to improve understanding of safety procedures.",
          },
        ],
      },
    },
  ],

  // Admin user
  admin: {
    id: 99,
    email: "admin@wildlife.com",
    password: "admin123",
    type: "admin",
    firstName: "Admin",
    lastName: "System",
    phone: "0120000000",
    permissions: {
      manageGuides: true,
      manageLicenses: true,
      viewReports: true,
    },
  },

  // License levels
  licenseLevels: [
    {
      level: "Junior Guide",
      requirements: ["Basic Training Course", "First Aid Certification"],
      maxGroupSize: 5,
      renewalPeriod: 1,
      salaryGrade: "G1",
    },
    {
      level: "Senior Guide",
      requirements: ["2+ years experience", "Advanced Wildlife Course", "CPR Certification"],
      maxGroupSize: 15,
      renewalPeriod: 2,
      salaryGrade: "G3",
    },
    {
      level: "Master Guide",
      requirements: ["5+ years experience", "Special Species Certification", "Advanced First Aid"],
      maxGroupSize: 25,
      renewalPeriod: 3,
      salaryGrade: "G5",
    },
  ],

  // Courses
  courses: [
    {
      id: 1,
      name: "Basic Wildlife Guide Course",
      duration: "2 weeks",
      price: 250,
      schedule: ["Mon-Wed-Fri", "9am-12pm"],
      instructor: "Dr. Chen",
      capacity: 15,
      requiredFor: ["Junior Guide"],
    },
    {
      id: 2,
      name: "Advanced Species Handling",
      duration: "1 month",
      price: 500,
      schedule: ["Tue-Thu", "2pm-5pm"],
      instructor: "Prof. Singh",
      capacity: 10,
      requiredFor: ["Senior Guide", "Master Guide"],
    },
    {
      id: 3,
      name: "Park Guiding Course",
      duration: "3 weeks",
      price: 350,
      schedule: ["Mon-Fri", "10am-1pm"],
      instructor: "Ms. Rachel Tan",
      capacity: 20,
      combines: ["CC104", "LH301"],
    },
    {
      id: 4,
      name: "Park Product and Service Course",
      duration: "2 weeks",
      price: 300,
      schedule: ["Mon-Wed", "2pm-4pm"],
      instructor: "Mr. Daniel Yong",
      capacity: 15,
      combines: ["SP204", "ER405"],
    },
  ],

  // Park sections
  parkSections: [
    {
      id: "ORANG",
      name: "Orangutan Sanctuary",
      guidesAssigned: [1, 3],
      specialRequirements: ["Primate Knowledge"],
    },
    {
      id: "BIRD",
      name: "Avian Observation Zone",
      guidesAssigned: [3],
      specialRequirements: ["Bird Watching Certification"],
    },
  ],

  // Helper methods
  getUserByEmail: function (email) {
    if (email === this.admin.email) return this.admin;
    return this.users.find((user) => user.email === email);
  },

  getGuides: function () {
    return this.users.filter((user) => user.type === "guide");
  },

  getGuideById: function (id) {
    return this.users.find((user) => user.id === id);
  },

  updateGuide: function (id, updatedData) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedData };
      return true;
    }
    return false;
  },

  getGuidesByStatus: function (status) {
    return this.users.filter(
      (user) =>
        user.type === "guide" &&
        (user.license?.status === status || (!user.license && status === "Unlicensed"))
    );
  },

  getGuidesBySpecialty: function (specialty) {
    return this.users.filter(
      (user) => user.type === "guide" && user.license?.specialty?.includes(specialty)
    );
  },

  getUpcomingRenewals: function (days = 30) {
    const today = new Date();
    return this.users.filter((user) => {
      if (!user.license || user.license.isExpired) return false;
      const expDate = new Date(user.license.expirationDate);
      const diffTime = expDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days && diffDays > 0;
    });
  },

  // ✅ Check if a guide has passed all required courses
  canApproveRenewal: function (guide) {
    if (!guide.license?.requiredCourses || !guide.license.courseAttempts) return false;

    return guide.license.requiredCourses.every((course) => {
      const attempt = guide.license.courseAttempts.find(
        (a) => a.courseCode === course.code && a.passed
      );
      return attempt !== undefined;
    });
  },

  // ✅ Admin-only method to check guide license renewal eligibility
  isGuideEligibleForRenewal: function (guide) {
    if (!guide.license || guide.license.status !== "Expired") return false;

    const licenseLevel = this.licenseLevels.find(
      (lvl) => lvl.level === guide.license.level
    );
    if (!licenseLevel) return false;

    const hasExperience = guide.license.yearsActive >= parseInt(licenseLevel.renewalPeriod);
    const feedbackOk = guide.license.feedbackScores?.overall >= 3.5;
    const coursesPassed = this.canApproveRenewal(guide);

    return hasExperience && feedbackOk && coursesPassed;
  },

  // ✅ Admin-only method to renew a guide’s license
  renewLicense: function (guideId) {
    const guide = this.getGuideById(guideId);
    if (!guide || !guide.license) return false;

    const today = new Date();
    const newExpDate = new Date();
    const licenseLevel = this.licenseLevels.find(
      (lvl) => lvl.level === guide.license.level
    );
    if (!licenseLevel) return false;

    newExpDate.setFullYear(today.getFullYear() + licenseLevel.renewalPeriod);

    guide.license.expirationDate = newExpDate.toISOString().split("T")[0];
    guide.license.status = "Active";
    guide.license.isExpired = false;
    guide.license.yearsActive += licenseLevel.renewalPeriod;

    return true;
  },
};