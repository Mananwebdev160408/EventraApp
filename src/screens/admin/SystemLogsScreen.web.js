import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Search,
  Calendar,
  Router,
  ShieldAlert,
  Download,
  Filter,
  RefreshCw,
  ChevronLeft,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { sosService } from "../../api/services";
import AdminSidebar from "../../components/AdminSidebar.web";

const SystemLogsScreen = ({ navigation }) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await sosService.getAllSos();
      const formattedLogs = Array.isArray(data)
        ? data.map((sos) => ({
            id: sos.id.toString(),
            title: `Emergency SOS Alert`,
            type: "Critical",
            user: `User ID: ${sos.userId}`,
            time: new Date(sos.timestamp).toLocaleString(),
            ip: "Reported via GPS",
            color: "#ef4444",
          }))
        : [];
      setLogs(formattedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <AdminSidebar navigation={navigation} activeNav="Logs" />

      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
           <View style={styles.headerTitleRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                 <ChevronLeft size={20} color="#1d3557" />
              </TouchableOpacity>
              <View>
                 <Text style={styles.headerTitle}>System Operations Logs</Text>
                 <Text style={styles.headerSub}>Audit trail of all emergency alerts and system events</Text>
              </View>
           </View>
           
           <View style={styles.headerActions}>
              <TouchableOpacity style={styles.refreshBtn} onPress={fetchLogs}>
                 <RefreshCw size={18} color="#1d3557" />
                 <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportBtn}>
                 <Download size={18} color="#fff" />
                 <Text style={styles.exportText}>Export Audit Trail</Text>
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
                       placeholder="Search by User ID, Title or Action..."
                       value={searchQuery}
                       onChangeText={setSearchQuery}
                    />
                 </View>
                 
                 <View style={styles.filterActions}>
                    <TouchableOpacity style={styles.filterToggle}>
                       <Filter size={16} color="#64748b" />
                       <Text style={styles.filterToggleText}>Filters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterToggle}>
                       <Calendar size={16} color="#64748b" />
                       <Text style={styles.filterToggleText}>Date Range</Text>
                    </TouchableOpacity>
                 </View>
              </View>

              {/* Data Table */}
              <View style={styles.tableCard}>
                 <View style={styles.tableHeader}>
                    <Text style={[styles.tableHCell, { flex: 2 }]}>EVENT / INCIDENT</Text>
                    <Text style={styles.tableHCell}>SEVERITY</Text>
                    <Text style={[styles.tableHCell, { flex: 1.5 }]}>SOURCE / USER</Text>
                    <Text style={[styles.tableHCell, { flex: 1.5 }]}>TIMESTAMP</Text>
                    <Text style={styles.tableHCell}>IP ADDRESS</Text>
                    <Text style={[styles.tableHCell, { textAlign: 'right' }]}>ACTION</Text>
                 </View>

                 {isLoading ? (
                   <View style={styles.loaderBox}>
                      <ActivityIndicator size="large" color={COLORS.brandPurple} />
                      <Text style={styles.loaderText}>Fetching operation logs...</Text>
                   </View>
                 ) : (
                   <View>
                      {filteredLogs.map((log) => (
                        <View key={log.id} style={styles.tableRow}>
                           <View style={[styles.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                              <View style={[styles.statusIndicator, { backgroundColor: log.color }]} />
                              <Text style={styles.eventTitle}>{log.title}</Text>
                           </View>
                           <View style={styles.tableCell}>
                              <View style={[styles.severityBadge, { backgroundColor: `${log.color}15` }]}>
                                 <Text style={[styles.severityText, { color: log.color }]}>{log.type}</Text>
                              </View>
                           </View>
                           <View style={[styles.tableCell, { flex: 1.5 }]}>
                              <Text style={styles.sourceText}>{log.user}</Text>
                           </View>
                           <View style={[styles.tableCell, { flex: 1.5 }]}>
                              <Text style={styles.timestampText}>{log.time}</Text>
                           </View>
                           <View style={styles.tableCell}>
                              <View style={styles.ipBox}>
                                 <Router size={14} color="#94a3b8" />
                                 <Text style={styles.ipText}>{log.ip}</Text>
                              </View>
                           </View>
                           <TouchableOpacity style={[styles.tableCell, { textAlign: 'right' }]}>
                              <Text style={styles.viewLink}>Full Report</Text>
                           </TouchableOpacity>
                        </View>
                      ))}
                      
                      {filteredLogs.length === 0 && (
                        <View style={styles.emptyBox}>
                           <ShieldAlert size={48} color="#e2e8f0" />
                           <Text style={styles.emptyText}>No matching logs found</Text>
                        </View>
                      )}
                   </View>
                 )}
              </View>
              
              <View style={styles.tableFooter}>
                 <Text style={styles.footerInfo}>Showing {filteredLogs.length} of {logs.length} total operations</Text>
                 <View style={styles.pagination}>
                    <TouchableOpacity style={styles.pageBtnDisabled}><Text style={styles.pageBtnText}>Previous</Text></TouchableOpacity>
                    <View style={styles.pageNumActive}><Text style={styles.pageNumTextActive}>1</Text></View>
                    <TouchableOpacity style={styles.pageBtn}><Text style={styles.pageBtnText}>Next</Text></TouchableOpacity>
                 </View>
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
  refreshBtn: {
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
  refreshText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  exportText: {
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
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: 'uppercase',
  },
  sourceText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  timestampText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  ipBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ipText: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
  viewLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
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
  tableFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32,
  },
  footerInfo: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  pageBtnDisabled: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    opacity: 0.5,
  },
  pageBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
  },
  pageNumActive: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1d3557",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumTextActive: {
    color: "#fff",
    fontWeight: "800",
  }
});

export default SystemLogsScreen;
