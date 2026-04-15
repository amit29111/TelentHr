import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {useNavigation} from '@react-navigation/native';

const MyPayRollScreen = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.navigate('DashboardScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Image
            source={require('../assets/victorIconImage/arrowLeft.png')}
            style={styles.arrowLeft
              
            }
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>My Pay Roll Screen</Text>
      </View>
      <View style={styles.centerContainer}>
        <Text style={styles.comingSoonText}>COMING SOON</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F2',
  },
  header: {
    backgroundColor: '#402530',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5, // Added for better touch area
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5C3C45',
    textTransform: 'uppercase',
  },
  eyeIcon: { position: 'absolute', right: 15 },
  arrowLeft: { width: 20, height: 20 },
});

export default MyPayRollScreen;



// import React, {useState} from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView
// } from "react-native";

// const ProfileScreen = () => {

//   const [activeTab, setActiveTab] = useState("Attendance");

//   const attendanceData = [
//     {label: "Total Days", value: "28"},
//     {label: "Total Working Days", value: "28"},
//     {label: "Total Holidays", value: "0"},
//     {label: "Total Days Present", value: "01"},
//     {label: "Total Days Absent", value: "27"},
//     {label: "Total Leave Days", value: "0"},
//     {label: "Total LWS Days", value: "0"},
//     {label: "Total Paid Half Days", value: "0"},
//     {label: "Total Unpaid Half Days", value: "0"},
//     {label: "Average Checkin", value: "N/A"},
//   ];

//   return (
//     <ScrollView style={styles.container}>

//       {/* Profile Header */}
//       <View style={styles.profileCard}>
//         <Image
//           source={{uri: "https://i.pravatar.cc/300"}}
//           style={styles.avatar}
//         />

//         <Text style={styles.name}>Tanishka Tyagi</Text>
//         <Text style={styles.role}>UI/UX Designer</Text>
//         <Text style={styles.empId}>E2031</Text>

//         <Text style={styles.info}>📧 tanishka.tyagi@talentcompliance.in</Text>
//         <Text style={styles.info}>📞 +91 9068359688</Text>
//         <Text style={styles.info}>📍 Sector 134, Noida, Uttar Pradesh</Text>
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabs}>
//         {["Personal Info","Job Details","Attendance","Leaves"].map(tab => (
//           <TouchableOpacity key={tab} onPress={()=>setActiveTab(tab)}>
//             <Text style={[
//               styles.tabText,
//               activeTab === tab && styles.activeTab
//             ]}>
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Attendance Card */}
//       {activeTab === "Attendance" && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Monthly Attendance Summary</Text>

//           {attendanceData.map((item,index)=>(
//             <View key={index} style={styles.row}>
//               <Text style={styles.label}>{item.label}</Text>
//               <Text style={styles.value}>{item.value}</Text>
//             </View>
//           ))}

//         </View>
//       )}

//     </ScrollView>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({

//   container:{
//     flex:1,
//     backgroundColor:"#f3f4f6"
//   },

//   profileCard:{
//     backgroundColor:"#fff",
//     alignItems:"center",
//     padding:20,
//     borderBottomLeftRadius:20,
//     borderBottomRightRadius:20
//   },

//   avatar:{
//     width:80,
//     height:80,
//     borderRadius:40,
//     marginBottom:10
//   },

//   name:{
//     fontSize:18,
//     fontWeight:"bold"
//   },

//   role:{
//     color:"#555"
//   },

//   empId:{
//     color:"#888",
//     marginBottom:10
//   },

//   info:{
//     fontSize:13,
//     color:"#444",
//     marginTop:2
//   },

//   tabs:{
//     flexDirection:"row",
//     justifyContent:"space-around",
//     backgroundColor:"#fff",
//     paddingVertical:10,
//     marginTop:10
//   },

//   tabText:{
//     color:"#555",
//     fontSize:14
//   },

//   activeTab:{
//     color:"#ef4444",
//     borderBottomWidth:2,
//     borderBottomColor:"#ef4444",
//     paddingBottom:4
//   },

//   card:{
//     backgroundColor:"#fff",
//     margin:15,
//     borderRadius:10,
//     padding:15
//   },

//   cardTitle:{
//     fontSize:16,
//     fontWeight:"600",
//     marginBottom:10
//   },

//   row:{
//     flexDirection:"row",
//     justifyContent:"space-between",
//     paddingVertical:6
//   },

//   label:{
//     color:"#ef4444"
//   },

//   value:{
//     color:"#333"
//   }

// });