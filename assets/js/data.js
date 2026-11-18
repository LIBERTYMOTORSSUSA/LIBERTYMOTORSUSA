
/* =========================================================
   LIBERTY MOTORS USA — WEBSITE DATABASE
   All dealership content is managed from this file.
   ========================================================= */

window.LIBERTY_DATA = {

  business: {
    name: "Liberty Motors USA",
    tagline: "Premium Automotive Excellence",
    country: "United States",
    logo: "",
    description:
      "Premium vehicles, quality automotive parts and professional automotive solutions."
  },

  emails: {
    general: "",
    sales: "",
    parts: "",
    services: ""
  },

  navigation: [
    { label: "Home", path: "/" },
    { label: "Vehicles", path: "/cars/" },
    { label: "Parts", path: "/parts/" },
    { label: "Services", path: "/services/" },
    { label: "About", path: "/about/" },
    { label: "Contact", path: "/contact/" }
  ],

  cars: [
    {
      id: "2022-mercedes-benz-s-class",
      name: "2022 Mercedes-Benz S-Class",
      brand: "Mercedes-Benz",
      model: "S-Class",
      year: 2022,
      price: "Contact for Price",
      condition: "Premium Pre-Owned",
      mileage: "Contact for details",
      transmission: "Automatic",
      fuel: "Petrol",
      exterior: "Black",
      interior: "Premium Leather",
      availability: "Available",
      image: "",
      images: [],
      description:
        "Experience refined luxury, advanced technology and exceptional comfort with this Mercedes-Benz S-Class.",
      specifications: {
        bodyStyle: "Luxury Sedan",
        drivetrain: "Contact for details",
        engine: "Contact for details"
      },
      features: [
        "Premium Interior",
        "Advanced Driver Assistance",
        "Luxury Comfort",
        "Modern Infotainment"
      ]
    }
  ],

  parts: [
    {
      id: "premium-suspension-lift-kit",
      name: "Premium Suspension Lift Kit",
      category: "Suspension",
      compatibility: "Contact us for vehicle compatibility",
      price: "Contact for Price",
      availability: "Contact for Availability",
      image: "",
      images: [],
      description:
        "Premium suspension components designed for performance, durability and an improved vehicle stance.",
      features: [
        "Premium Components",
        "Precision Engineering",
        "Professional Installation Recommended"
      ]
    }
  ],

  services: [
    {
      id: "automotive-parts-sourcing",
      name: "Automotive Parts Sourcing",
      category: "Parts",
      price: "Request a Quote",
      availability: "Available",
      image: "",
      description:
        "We help customers source automotive components suited to their vehicle and requirements."
    },
    {
      id: "vehicle-sales-assistance",
      name: "Vehicle Sales Assistance",
      category: "Vehicle Sales",
      price: "Contact Us",
      availability: "Available",
      image: "",
      description:
        "Get assistance finding a vehicle that matches your preferences and requirements."
    }
  ],

  pages: {
    about: {
      title: "About Liberty Motors",
      description:
        "Discover Liberty Motors USA and our commitment to automotive excellence."
    },

    contact: {
      title: "Contact Liberty Motors",
      description:
        "Speak with our team about vehicles, automotive parts and services."
    }
  }

};

