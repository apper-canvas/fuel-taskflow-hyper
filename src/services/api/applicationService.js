import applicationsData from "@/services/mockData/applications.json";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const applications = [...applicationsData];
let nextId = Math.max(...applications.map(app => app.Id), 0) + 1;

export const applicationService = {
  async getAll() {
    await delay(300);
    return [...applications];
  },

  async getById(id) {
    await delay(200);
    if (typeof id !== 'number') {
      throw new Error('Application ID must be a number');
    }
    
    const application = applications.find(app => app.Id === id);
    if (!application) {
      throw new Error('Application not found');
    }
    
    return { ...application };
  },

  async getByJobId(jobId) {
    await delay(200);
    if (typeof jobId !== 'number') {
      throw new Error('Job ID must be a number');
    }
    
    return applications
      .filter(app => app.jobId === jobId)
      .map(app => ({ ...app }));
  },

  async getByCandidateId(candidateId) {
    await delay(200);
    if (typeof candidateId !== 'number') {
      throw new Error('Candidate ID must be a number');
    }
    
    return applications
      .filter(app => app.candidateId === candidateId)
      .map(app => ({ ...app }));
  },

  async create(applicationData) {
    await delay(500);
    
    // Validate required fields
    if (!applicationData.jobId || !applicationData.candidateId) {
      throw new Error('Job ID and Candidate ID are required');
    }

    // Check if application already exists
    const existingApp = applications.find(
      app => app.jobId === applicationData.jobId && app.candidateId === applicationData.candidateId
    );
    
    if (existingApp) {
      throw new Error('Candidate has already been applied to this job');
    }

const newApplication = {
      Id: nextId++,
      jobId: applicationData.jobId,
      candidateId: applicationData.candidateId,
      appliedAt: new Date().toISOString(),
status: 'applied',
      notes: applicationData.notes || '',
      notesCount: 0
    };

    applications.push(newApplication);
    return { ...newApplication };
  },

  // Update application status
async updateStatus(applicationId, newStatus) {
    await delay(300);
    
    // Validate application ID
    if (!applicationId || typeof applicationId !== 'number') {
      throw new Error('Invalid application ID');
    }
    
    const validStatuses = ['applied', 'screening', 'interview_scheduled', 'final_review', 'hired', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}. Valid statuses are: ${validStatuses.join(', ')}`);
    }

    const applicationIndex = applications.findIndex(app => app.Id === applicationId);
    if (applicationIndex === -1) {
      throw new Error(`Application with ID ${applicationId} not found`);
    }

    // Update the application status and timestamp
    applications[applicationIndex].status = newStatus;
    applications[applicationIndex].updatedAt = new Date().toISOString();
    
    return { ...applications[applicationIndex] };
  },

  async update(id, applicationData) {
    await delay(400);
    
    if (typeof id !== 'number') {
      throw new Error('Application ID must be a number');
    }

    const index = applications.findIndex(app => app.Id === id);
    if (index === -1) {
      throw new Error('Application not found');
    }

    const updatedApplication = {
      ...applications[index],
      ...applicationData,
      Id: applications[index].Id // Preserve original ID
    };

    applications[index] = updatedApplication;
    return { ...updatedApplication };
  },

  async delete(id) {
    await delay(300);
    
    if (typeof id !== 'number') {
      throw new Error('Application ID must be a number');
    }

    const index = applications.findIndex(app => app.Id === id);
    if (index === -1) {
      throw new Error('Application not found');
    }

    const deletedApplication = { ...applications[index] };
    applications.splice(index, 1);
    return deletedApplication;
  },

async checkApplication(jobId, candidateId) {
    await delay(100);
    
    return applications.find(
      app => app.jobId === jobId && app.candidateId === candidateId
    ) || null;
  },

  // Schedule interview for an application
  async scheduleInterview(applicationId, interviewData) {
    await delay(400);
    
    if (typeof applicationId !== 'number') {
      throw new Error('Application ID must be a number');
    }

    const applicationIndex = applications.findIndex(app => app.Id === applicationId);
    if (applicationIndex === -1) {
      throw new Error('Application not found');
    }

    // Validate interview data
    const { date, time, interviewer, type, notes } = interviewData;
    if (!date || !time || !interviewer || !type) {
      throw new Error('Date, time, interviewer, and type are required');
    }

    const validTypes = ['Phone', 'Video', 'In-person'];
    if (!validTypes.includes(type)) {
      throw new Error('Invalid interview type');
    }

    applications[applicationIndex].interview = {
      date,
      time,
      interviewer,
      type,
      notes: notes || ''
    };

    // Ensure status is interview_scheduled
    applications[applicationIndex].status = 'interview_scheduled';

    return { ...applications[applicationIndex] };
  },

  // Update interview details
  async updateInterview(applicationId, interviewData) {
    await delay(400);
    
    if (typeof applicationId !== 'number') {
      throw new Error('Application ID must be a number');
    }

    const applicationIndex = applications.findIndex(app => app.Id === applicationId);
    if (applicationIndex === -1) {
      throw new Error('Application not found');
    }

    if (!applications[applicationIndex].interview) {
      throw new Error('No interview scheduled for this application');
    }

    applications[applicationIndex].interview = {
      ...applications[applicationIndex].interview,
      ...interviewData
    };

    return { ...applications[applicationIndex] };
  },

  // Get upcoming interviews
  async getUpcomingInterviews() {
    await delay(200);
    
    const now = new Date();
    const upcomingInterviews = applications
      .filter(app => app.interview && app.status === 'interview_scheduled')
      .map(app => ({
        ...app,
        interviewDateTime: new Date(`${app.interview.date}T${app.interview.time}`)
      }))
      .filter(app => app.interviewDateTime >= now)
      .sort((a, b) => a.interviewDateTime - b.interviewDateTime);

    return upcomingInterviews.map(app => {
      const { interviewDateTime, ...rest } = app;
      return rest;
    });
  }
};