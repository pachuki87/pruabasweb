import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type CourseRatingProps = {
  courseId: string;
  studentId: string;
  initialRating?: number;
  onRatingSubmit?: () => void;
};

const CourseRating: React.FC<CourseRatingProps> = ({
  courseId,
  studentId,
  initialRating = 0,
  onRatingSubmit
}) => {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('course_ratings')
        .upsert({
          course_id: courseId,
          student_id: studentId,
          rating,
          review: review.trim()
        });

      if (error) throw error;
      
      setShowForm(false);
      if (onRatingSubmit) onRatingSubmit();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center text-yellow-500 hover:text-yellow-600"
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < rating ? 'fill-current' : ''}`}
            />
          ))}
          <span className="ml-2 text-gray-600">Rate this course</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Rate this course</h3>
          
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className={`text-2xl ${
                  i < rating ? 'text-yellow-500' : 'text-gray-300'
                } hover:text-yellow-500 focus:outline-none`}
              >
                <Star className={`w-8 h-8 ${i < rating ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Write your review..."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CourseRating;