const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      // Add all form fields, only append photo if it exists
      Object.keys(formData).forEach(key => {
        if (key === 'photo') {
          // Only append photo if it exists and is not null
          if (formData[key]) {
            form.append('photo', formData[key]);
          }
        } else {
          // Append other fields, but avoid appending null/undefined values
          if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
            form.append(key, formData[key]);
          }
        }
      });

      const response = await fetch('/api/alumni', {
        method: 'POST',
        body: form,
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