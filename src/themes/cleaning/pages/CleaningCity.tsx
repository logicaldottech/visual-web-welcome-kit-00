

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { httpFile } from "../../../config.js";
import { MapPin, Clock, Shield } from 'lucide-react';
import { Star, StarHalf, Quote } from "lucide-react";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Testimonial {
  review_text: string;
  customer_image: string;
  customer_name: string;
  rating: number | string; // could be 4.5, "3.5", etc.
}


import { slugify } from "../../../extras/slug";
import humanizeString from "../../../extras/stringUtils.js";

import CleaningHeader from '../components/CleaningHeader';
import CleaningCTA from '../components/CleaningCTA';
import CleaningAboutUs from '../components/CleaningAboutUs';
import CleaningServices from '../components/CleaningServices';
import CleaningWhyChooseUs from '../components/CleaningWhyChooseUs';
import CleaningProcess from '../components/CleaningProcess';
import CleaningGuarantee from '../components/CleaningGuarantee';
import CleaningTestimonials from '../components/CleaningTestimonials';
import CleaningServiceAreas from '../components/CleaningServiceAreas';
import ServiceMap from '../../../components/ServiceMap';
import CleaningFAQ from '../components/CleaningFAQ';
import CleaningFooter from '../components/CleaningFooter';
import { Building } from 'lucide-react';
import CleaningLoader from '../components/CleaningLoader';

const CleaningCity = () => {








  const location = useLocation();
  const navigate = useNavigate();

  const [projectLocations, setProjectLocations] = useState([]);
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
   const [projectFaqs, setprojectFaqs] = useState([]);
  const currentLocation = location.pathname;
  const RefLocation = currentLocation.slice(1);
  console.log('Path without leading slash:', RefLocation);
  const [projectServices, setprojectServices] = useState([]);

  const cityName = currentLocation.split('/').pop();
  console.log('Text after last slash:', cityName);

  const [projectReviews, setProjectReviews] = useState<Testimonial[]>([]);


  const [projectCategory, setProjectCategory] = useState("");
  const [pageLocation, setPageLocation] = useState("");

  const savedSiteId = localStorage.getItem("currentSiteId");
  let projectId = savedSiteId || "685cffa53ee7098086538c06";
  const [locations, setLocations] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  let { id,

    UpcomingPage,
    nextPage,
    locationName,

    _id } = location.state || {};

  const handleLocationClick = (locationName, id, _id) => {





    let nextPage = ''

    if (UpcomingPage == 'country') {

      nextPage = 'States'
    }
    else if (UpcomingPage == 'state') {

      nextPage = 'Cities'
    }

    if (UpcomingPage == 'city') {

      nextPage = 'Local Areas'
    }

    if (UpcomingPage == 'local') {

      nextPage = 'whole areas'
    }

    let locationToNavigate = `/${RefLocation}/${slugify(locationName)}`



    navigate(locationToNavigate, {
      state: {
        id,
        projectId,
        UpcomingPage,
        nextPage,
        locationName,
        // oldPage,
        _id
      }
    });


    // log the startFrom value

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await httpFile.post("/webapp/v1/my_site", {
          projectId,
          pageType: UpcomingPage,
          refId: id,
          _id: _id,
          RefLocation: RefLocation,
          reqFrom:"cleaningCity"


        });

        console.log(data)

        if (data.projectInfo && data.projectInfo.serviceType) {
          setProjectCategory(data.projectInfo.serviceType);
          setProjectLocations(data.locations);
          setProjectReviews(data.testimonials || []);

          setprojectFaqs(data.faq || []);

          setLocations(data.locations);

          setPageLocation(data.RefLocation)
      setIsLoading(false);


        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId]);


  const getFirstSentence = (text: string) => {
    if (!text) return '';
    const idx = text.indexOf('.');
    return idx > -1 ? text.slice(0, idx + 1) : text;
  };

   const handleServiceClick = (service: any) => {
      const serviceName = service.service_name.toLowerCase().replace(/\s+/g, '-');
      navigate(`/services/${serviceName}`, {
        state: {
          serviceId: service._id,
          serviceName: service.service_name,
          serviceDescription: service.service_description,
          locationName:`${humanizeString(cityName)}`,

          serviceImage: service.images[0]?.url || "https://img.freepik.com/free-photo/standard-quality-control-concept-m_23-2150041850.jpg",
          serviceImage1: service.images[1]?.url || "https://img.freepik.com/free-photo/standard-quality-control-concept-m_23-2150041850.jpg",
          serviceImage2: service.images[2]?.url || "https://img.freepik.com/free-photo/standard-quality-control-concept-m_23-2150041850.jpg"
        }
      });
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data } = await httpFile.post("/webapp/v1/fetch_services", {
            projectId,
          });
  
          if (data) {
            setprojectServices(data.services || []);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [projectId]);
  
  
  
  

  console.log(pageLocation, "pageLocation")


    if (isLoading) {
      return <CleaningLoader />;
    }

  return (
    <div className="min-h-screen font-poppins">
      <CleaningHeader />

      {/* City Hero */}
      <section className="relative py-20 bg-gradient-to-br from-green-600 to-emerald-600 text-white overflow-hidden min-h-[500px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/85 to-emerald-600/85"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <div className="flex items-center justify-center mb-4">
            <Building className="w-8 h-8 text-emerald-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold"> {humanizeString(cityName)} {projectCategory} Services</h1>
          </div>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            {projectCategory} services in {humanizeString(cityName)}.
          </p>
        </div>
      </section>

      <CleaningCTA />
      {/* <CleaningAboutUs /> */}
 <section className="py-20 bg-white font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              Our {projectCategory} Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive {projectCategory} solutions for you and we make sure for professional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectServices.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.images[0]?.url || "https://img.freepik.com/free-photo/standard-quality-control-concept-m_23-2150041850.jpg"}
                    alt={service.service_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className={`absolute top-4 left-4 bg-gradient-to-r ${service.gradient} rounded-full p-3 text-white shadow-lg`}>
                    <i className={service.fas_fa_icon} />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.service_name} in {humanizeString(cityName)}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed"> {getFirstSentence(service.service_description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CleaningCTA />
      <CleaningWhyChooseUs />
      <CleaningProcess />
      <CleaningCTA />
      <CleaningGuarantee />
      <section className="py-20 bg-white font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied
              customers have to say about our cleaning services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectReviews.map((testimonial, index) => {
              // 1) Coerce rating into a number:
              const rawRating = Number(testimonial.rating) || 0;
              // 2) Compute how many full stars:
              const fullStars = Math.floor(rawRating);
              // 3) Check if there's a half star (only one half max):
              const hasHalf = rawRating - fullStars >= 0.5;
              // 4) Remaining empty stars to reach 5 total:
              const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="mb-6">
                    <Quote className="w-10 h-10 text-green-500 mb-4" />
                    <p className="text-gray-700 leading-relaxed text-lg">
                      "{testimonial.review_text}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* <img
                        src={testimonial.customer_image}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      /> */}
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {testimonial.customer_name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {testimonial.customer_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      {/* Full stars */}
                      {[...Array(fullStars)].map((_, i) => (
                        <Star
                          key={`full-${index}-${i}`}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                      {/* One half star if needed */}
                      {hasHalf && (
                        <StarHalf
                          key={`half-${index}`}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      )}
                      {/* Empty stars */}
                      {[...Array(emptyStars)].map((_, i) => (
                        <Star
                          key={`empty-${index}-${i}`}
                          className="w-5 h-5 text-gray-300 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <CleaningCTA />
      <section className="py-20 bg-gray-50 font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              Areas We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional {projectCategory} services throughout Our availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((area, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3 mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{area.name}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 text-green-500 mr-3" />
                    <span>Response time: Extreme</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Shield className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>100% Original services</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLocationClick(area.name, area.location_id, area._id)}
                  className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                >
                  See Areas
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <ServiceMap theme="cleaning" /> */}
       <section className="py-20 bg-white font-poppins">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            Frequently Asked Questionss
          </h2>
          <p className="text-xl text-gray-600">
            Got questions? We've got answers. Here are the most common questions about our cleaning services.
          </p>
        </div>

        <div className="space-y-4">
          {projectFaqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <button
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <h3 className="text-lg font-bold text-gray-900 pr-4">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUp className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
      <CleaningCTA />
      <CleaningFooter />
    </div>
  );
};

export default CleaningCity;
