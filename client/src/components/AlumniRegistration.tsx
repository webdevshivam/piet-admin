const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      // Add all form fields except photo
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData[key]) {
          form.append('photo', formData[key]); // File upload
        } else if (key !== 'photo') {
          form.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/alumni', {
        method: 'POST',
        body: form, // FormData for file upload
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Alumni registered successfully:', result);
        alert('Registration submitted successfully!');
        // Reset form
        setFormData({
          photo: null,
          name: '',
          batch: '',
          fromCity: '',
          currentCity: '',
          companyName: '',
          position: '',
          email: '',
          phone: '',
          achievements: ''
        });
      } else {
        const error = await response.json();
        console.error('Registration failed:', error);
        alert('Registration failed: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please try again.');
    }
  };