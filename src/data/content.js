export const getGreetingTime = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) return 'Good morning... आणि पुन्हा एकदा thank you!';
  if (currentHour >= 12 && currentHour < 18) return 'Good afternoon... hope तुझा दिवस छान चाललाय!';
  if (currentHour >= 18 || currentHour < 5) return 'Good evening... तुझ्यासारख्या लोकांचा विचार करत आहे!';
  return 'Thank you!';
};

export const messages = {
  friends: {
    badge: "Friends",
    timeline: [
      {
        title: "9th May...",
        text: "आज माझा वाढदिवस आहे, आणि तू तो विसरला नाहीस!",
        sub: "भावा, तुझे wishes आणि ते chaos... विषयच वेगळा आहे!"
      },
      {
        title: "The Vibe",
        text: "Honestly, तुझ्यासारखे मित्र सोबतीला असले की दिवस आपोआप special होतो.",
        sub: "Everything feels 10x better with you guys."
      },
      {
        title: "Real Ones",
        text: "नेहमी असेच real आणि सोबत राहा. तू माझ्या आयुष्यातला खूप महत्त्वाचा भाग आहेस.",
        sub: "Thank you for being there, always!"
      }
    ]
  },
  family: {
    badge: "Family",
    timeline: [
      {
        title: "9th May...",
        text: "आज माझा वाढदिवस आहे, आणि तुमच्या प्रेमामुळे तो पूर्ण झाला.",
        sub: "तुम्ही नेहमीच माझे constant support आहात."
      },
      {
        title: "Home",
        text: "तुमच्या शुभेच्छा फक्त शब्द नाहीत, ते माझ्यासाठी खूप मोठं पाठबळ आहे.",
        sub: "No matter what happens, you are my home."
      },
      {
        title: "Gratitude",
        text: "तुमच्यामुळेच मी आज इथपर्यंत पोहोचलोय. खूप खूप थँक यू!",
        sub: "And that means everything to me right now."
      }
    ]
  },
  relatives: {
    badge: "Relatives",
    timeline: [
      {
        title: "9th May...",
        text: "आज माझा वाढदिवस आहे, आणि तुम्ही आठवण काढली, खूप छान वाटलं.",
        sub: "तुमच्या आशीर्वादाने हा दिवस खास झाला आहे."
      },
      {
        title: "Blessings",
        text: "तुमच्या शुभेच्छा खऱ्या अर्थाने खूप जास्त matter करतात.",
        sub: "Thanks for all the love and support today."
      }
    ]
  },
  special: {
    badge: "Special One",
    timeline: [
      {
        title: "9th May...",
        text: "आज माझा वाढदिवस आहे, आणि तुझं माझ्या आयुष्यात असणं हीच माझ्यासाठी सर्वात मोठी wish आहे.",
        sub: "तू वेळ काढलायस, I appreciate it more than you know."
      },
      {
        title: "Unique Bond",
        text: "इथे प्रत्येकाला इतकी जवळची जागा मिळत नाही, पण तू खूप different आहेस.",
        sub: "You make this day feel like magic."
      },
      {
        title: "Meaning",
        text: "तुझ्यामुळेच आजच्या दिवसाला एक वेगळा अर्थ मिळाला आहे.",
        sub: "I just want you to know how much I value you."
      }
    ]
  },
  default: {
    badge: "Special Message",
    timeline: [
      {
        title: "9th May...",
        text: "आज माझा वाढदिवस आहे, आणि तुझी इच्छा वाचून खूप आनंद झाला.",
        sub: "तुझं प्रेम आणि support खरंच खूप प्रोत्साहन देणारं आहे."
      },
      {
        title: "Real Gift",
        text: "तू वेळ काढून मला wish करतोयस, हेच माझ्यासाठी खूप आहे.",
        sub: "Thank you for making my day special."
      }
    ]
  }
};
