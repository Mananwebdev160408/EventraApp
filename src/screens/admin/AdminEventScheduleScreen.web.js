import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Plus,
  MapPin,
  Search,
  Clock,
  Zap,
  Calendar,
  MoreVertical,
  Filter,
  Download,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { eventService, stadiumService } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import AdminSidebar from "../../components/AdminSidebar.web";

const AdminEventScheduleScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const { stadiumLocation, stadiumId: contextStadiumId } = useUser();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stadiumId, setStadiumId] = useState(contextStadiumId);
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    initializeData();
  }, [contextStadiumId]);

  const initializeData = async () => {
    setIsLoading(true);
    let currentStadiumId = contextStadiumId;

    if (!currentStadiumId && userInfo?.email) {
      try {
        const stadiums = await stadiumService.getAllStadiums();
        const myStadium = stadiums.find(
          (s) => s.adminEmail === userInfo.email || s.adminEmail === userInfo.username
        );
        if (myStadium) {
          currentStadiumId = myStadium.id;
          setStadiumId(currentStadiumId);
        }
      } catch (error) {
        console.error("Error fetching admin stadium:", error);
      }
    }
    await fetchEvents(currentStadiumId);
  };

  const fetchEvents = async (sid = stadiumId) => {
    setIsLoading(true);
    try {
      const data = await eventService.getEvents({ stadiumId: sid });
      const eventList = Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
      setEvents(eventList);
    } catch (error) {
      console.error("Error fetching admin events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoLive = async (eventId) => {
    try {
      await eventService.goEventLive(eventId);
      alert("Event is now LIVE!");
      fetchEvents();
    } catch (error) {
      console.error("Error going live:", error);
    }
  };

  const query = (searchQuery || "").toLowerCase();
  const filteredEvents = events.filter((event) =>
    (event.name || event.title || "").toLowerCase().includes(query)
  );

  const formatEventDate = (dateStr) => {
    if (!dateStr) return "TBA";
    const date = new Date(dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T"));
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatEventTime = (dateStr) => {
    if (!dateStr) return "TBA";
    const date = new Date(dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T"));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <AdminSidebar navigation={navigation} activeNav="Schedule" />

      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
           <View style={styles.headerTitleRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                 <ChevronLeft size={20} color="#1d3557" />
              </TouchableOpacity>
              <View>
                 <Text style={styles.headerTitle}>Event Schedule</Text>
                 <Text style={styles.headerSub}>{stadiumLocation} • Master Timeline</Text>
              </View>
           </View>
           
           <View style={styles.headerActions}>
              <TouchableOpacity style={styles.downloadBtn}>
                 <Download size={18} color="#1d3557" />
                 <Text style={styles.downloadText}>Export Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("AddEvent")}>
                 <Plus size={18} color="#fff" />
                 <Text style={styles.addText}>Create New Event</Text>
              </TouchableOpacity>
           </View>
        </View>

        <ScrollView style={styles.scrollArea}>
           <View style={styles.contentPadding}>
              {/* Filter Bar */}
              <View style={styles.filterBar}>
                 <View style={styles.searchBar}>
                    <Search size={18} color="#94a3b8" />
                    <TextInput 
                       style={styles.searchInput}
                       placeholder="Search events by title or category..."
                       value={searchQuery}
                       onChangeText={setSearchQuery}
                    />
                 </View>
                 
                 <View style={styles.filterActions}>
                    <TouchableOpacity style={styles.filterToggle}>
                       <Filter size={16} color="#64748b" />
                       <Text style={styles.filterToggleText}>Category</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterToggle}>
                       <Calendar size={16} color="#64748b" />
                       <Text style={styles.filterToggleText}>Monthly View</Text>
                    </TouchableOpacity>
                 </View>
              </View>

              {/* Event Table */}
              <View style={styles.tableCard}>
                 <View style={styles.tableHeader}>
                    <Text style={[styles.tableHCell, { flex: 2 }]}>EVENT / MATCH TITLE</Text>
                    <Text style={styles.tableHCell}>DATE</Text>
                    <Text style={styles.tableHCell}>START TIME</Text>
                    <Text style={styles.tableHCell}>STATUS</Text>
                    <Text style={styles.tableHCell}>CATEGORY</Text>
                    <Text style={[styles.tableHCell, { textAlign: 'right' }]}>COMMAND</Text>
                 </View>

                 {isLoading ? (
                   <View style={styles.loaderBox}>
                      <ActivityIndicator size="large" color="#1d3557" />
                      <Text style={styles.loaderText}>Syncing stadium schedule...</Text>
                   </View>
                 ) : (
                   <View>
                      {filteredEvents.map((event) => {
                        const isLive = event.status === "LIVE" || event.status === "ongoing";
                        return (
                          <View key={event.id} style={styles.tableRow}>
                             <View style={[styles.tableCell, { flex: 2 }]}>
                                <Text style={styles.eventTitle}>{event.name || event.title}</Text>
                                <View style={styles.venueRow}>
                                   <MapPin size={12} color="#94a3b8" />
                                   <Text style={styles.venueText}>{event.stadiumName || stadiumLocation}</Text>
                                </View>
                             </View>
                             
                             <View style={styles.tableCell}>
                                <Text style={styles.dateText}>{formatEventDate(event.dateTime || event.date)}</Text>
                             </View>
                             
                             <View style={styles.tableCell}>
                                <View style={styles.timeRow}>
                                   <Clock size={14} color="#94a3b8" />
                                   <Text style={styles.timeText}>{formatEventTime(event.dateTime || event.time)}</Text>
                                </View>
                             </View>
                             
                             <View style={styles.tableCell}>
                                <View style={[styles.statusBadge, { backgroundColor: isLive ? '#fef2f2' : '#f0fdf4' }]}>
                                   <View style={[styles.statusDot, { backgroundColor: isLive ? '#ef4444' : '#10b981' }]} />
                                   <Text style={[styles.statusText, { color: isLive ? '#ef4444' : '#10b981' }]}>{event.status || "Scheduled"}</Text>
                                </View>
                             </View>
                             
                             <View style={styles.tableCell}>
                                <View style={styles.catBadge}>
                                   <Text style={styles.catText}>{event.category || "General"}</Text>
                                </View>
                             </View>
                             
                             <View style={[styles.tableCell, { textAlign: 'right', flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }]}>
                                {!isLive && (
                                   <TouchableOpacity style={styles.goLiveBtn} onPress={() => handleGoLive(event.id)}>
                                      <Zap size={14} color="#fff" />
                                      <Text style={styles.goLiveText}>Go Live</Text>
                                   </TouchableOpacity>
                                )}
                                <TouchableOpacity style={styles.moreBtn}>
                                   <MoreVertical size={18} color="#94a3b8" />
                                </TouchableOpacity>
                             </View>
                          </View>
                        );
                      })}
                      
                      {filteredEvents.length === 0 && (
                        <View style={styles.emptyBox}>
                           <Calendar size={48} color="#e2e8f0" />
                           <Text style={styles.emptyText}>No events scheduled in this period</Text>
                           <TouchableOpacity style={styles.emptyAddBtn} onPress={() => navigation.navigate("AddEvent")}>
                              <Text style={styles.emptyAddText}>Schedule First Event</Text>
                           </TouchableOpacity>
                        </View>
                      )}
                   </View>
                 )}
              </View>
           </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
  },
  mainContent: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 60,
    paddingVertical: 32,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1e293b",
  },
  headerSub: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  downloadText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: "0px 10px 20px rgba(29, 53, 87, 0.2)",
  },
  addText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 60,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    gap: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    maxWidth: 600,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
  },
  filterActions: {
    flexDirection: "row",
    gap: 12,
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    boxShadow: "0px 20px 50px rgba(0,0,0,0.03)",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableHCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  venueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  venueText: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "700",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: 'uppercase',
  },
  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  catText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "700",
  },
  goLiveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1d3557",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  goLiveText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  loaderBox: {
    paddingVertical: 100,
    alignItems: "center",
    gap: 16,
  },
  loaderText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "600",
  },
  emptyBox: {
    paddingVertical: 100,
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "600",
  },
  emptyAddBtn: {
    marginTop: 8,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyAddText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  }
});

export default AdminEventScheduleScreen;
