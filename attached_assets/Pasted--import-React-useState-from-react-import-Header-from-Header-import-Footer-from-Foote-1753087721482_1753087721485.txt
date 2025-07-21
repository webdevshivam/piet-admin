
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const AlumniRegistration = () => {
  const [formData, setFormData] = useState({
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Registration submitted successfully!');
  };

  return (
    <div>
      <Header />

      {/* Breadcrumb */}
      <div className="px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/alumni">Alumni</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Alumni Registration</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Alumni Content Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Join Our Alumni Network</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with thousands of PIET graduates who are making their mark across industries worldwide. 
              Be part of a vibrant community that continues to grow and support each other.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <div className="text-center">
                  <i className="fas fa-users text-4xl text-primary mb-4"></i>
                  <CardTitle>Strong Network</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Connect with over 10,000+ alumni working in top companies across the globe
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-center">
                  <i className="fas fa-handshake text-4xl text-primary mb-4"></i>
                  <CardTitle>Mentorship</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Get guidance from experienced professionals and mentor the next generation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-center">
                  <i className="fas fa-briefcase text-4xl text-primary mb-4"></i>
                  <CardTitle>Career Growth</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Access exclusive job opportunities and career advancement resources
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alumni Success Stories */}
          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-center text-primary mb-8">Alumni Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-quote-left text-white text-2xl"></i>
                </div>
                <p className="text-gray-700 mb-4">
                  "PIET not only provided me with technical knowledge but also shaped my leadership skills. 
                  Today, I'm proud to be leading innovation at a Fortune 500 company."
                </p>
                <h4 className="font-semibold">Rajesh Kumar - Batch 2018</h4>
                <p className="text-sm text-gray-600">Senior Software Engineer, Google</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-quote-left text-white text-2xl"></i>
                </div>
                <p className="text-gray-700 mb-4">
                  "The entrepreneurial spirit fostered at PIET helped me start my own tech company. 
                  The alumni network has been instrumental in my journey."
                </p>
                <h4 className="font-semibold">Priya Sharma - Batch 2016</h4>
                <p className="text-sm text-gray-600">Founder & CEO, TechVision Solutions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Alumni Registration Form</CardTitle>
            <CardDescription className="text-center">
              Please fill out the form below to join our alumni network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo">Student Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Batch */}
              <div className="space-y-2">
                <Label htmlFor="batch">Batch Year *</Label>
                <Select name="batch" onValueChange={(value) => setFormData(prev => ({...prev, batch: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your batch year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 25}, (_, i) => {
                      const year = 2025 - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From City */}
                <div className="space-y-2">
                  <Label htmlFor="fromCity">Where are you from? *</Label>
                  <Input
                    id="fromCity"
                    name="fromCity"
                    type="text"
                    required
                    value={formData.fromCity}
                    onChange={handleInputChange}
                    placeholder="Your hometown"
                  />
                </div>

                {/* Current City */}
                <div className="space-y-2">
                  <Label htmlFor="currentCity">Current City *</Label>
                  <Input
                    id="currentCity"
                    name="currentCity"
                    type="text"
                    required
                    value={formData.currentCity}
                    onChange={handleInputChange}
                    placeholder="Your current city"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Current Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Your current employer"
                  />
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="position">Current Position *</Label>
                  <Input
                    id="position"
                    name="position"
                    type="text"
                    required
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Your job title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <Label htmlFor="achievements">Notable Achievements</Label>
                <Textarea
                  id="achievements"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleInputChange}
                  placeholder="Share your professional achievements, awards, publications, or any notable contributions..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button type="submit" className="px-8 py-3 text-lg">
                  <i className="fas fa-user-plus mr-2"></i>
                  Register as Alumni
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AlumniRegistration;
