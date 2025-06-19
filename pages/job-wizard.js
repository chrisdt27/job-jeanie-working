import { useState } from 'react';

export default function JobWizard() {
  const [step, setStep] = useState(1);
  const [job, setJob] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    budget: '',
    urgency: false,
  });

  const updateField = (field, value) => {
    setJob({ ...job, [field]: value });
  };

  const handleSubmit = () => {
    alert(`✅ Job submitted!\n\n${JSON.stringify(job, null, 2)}`);
    // In production, you'd send this data to a backend API here
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: 'auto' }}>
      <h1>Job Wizard — Step {step}</h1>

      {step === 1 && (
        <>
          <label>Job Title:</label>
          <input
            type="text"
            value={job.title}
            onChange={(e) => updateField('title', e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
            placeholder="e.g., Fix leaky faucet"
          />

          <label>Description:</label>
          <textarea
            value={job.description}
            onChange={(e) => updateField('description', e.target.value)}
            style={{ width: '100%', height: '80px', padding: '8px' }}
            placeholder="Brief description of the task"
          />
        </>
      )}

      {step === 2 && (
        <>
          <label>Location:</label>
          <input
            type="text"
            value={job.location}
            onChange={(e) => updateField('location', e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
            placeholder="Zip code or city"
          />

          <label>Preferred Date:</label>
          <input
            type="date"
            value={job.date}
            onChange={(e) => updateField('date', e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </>
      )}

      {step === 3 && (
        <>
          <label>Budget (USD):</label>
          <input
            type="number"
            value={job.budget}
            onChange={(e) => updateField('budget', e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
            placeholder="e.g., 150"
          />

          <label>
            <input
              type="checkbox"
              checked={job.urgency}
              onChange={(e) => updateField('urgency', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            This job is urgent
          </label>
        </>
      )}

      {step === 4 && (
        <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <h3>Review Your Job Details:</h3>
          <pre>{JSON.stringify(job, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} style={{ marginRight: '1rem' }}>
            Back
          </button>
        )}
        {step < 4 && (
          <button onClick={() => setStep(step + 1)}>
            Next
          </button>
        )}
        {step === 4 && (
          <button onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </main>
  );
}
