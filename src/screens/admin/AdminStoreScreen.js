import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  ShoppingBag,
  Search,
  Filter,
  MoreVertical,
  Coffee,
  X,
  Upload,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { foodService, merchandiseService } from "../../api/services";
import { useUser } from "../../context/UserContext";

const AdminStoreScreen = ({ navigation }) => {
  const { stadiumLocation } = useUser();
  const [activeTab, setActiveTab] = useState("Merchandise");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form states
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemStock, setItemStock] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemSubCategory, setItemSubCategory] = useState(
    activeTab === "Merchandise" ? "T-Shirt" : "None",
  );
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      let data;
      if (activeTab === "Merchandise") {
        data = await merchandiseService.getAllMerchandise();
      } else {
        // Fallback or use a specific restaurant ID if needed
        data = await foodService.getAllFoodOrders(); // Note: This service name in services.js seems to return orders, need to check if there is a getFood
      }
      setItems(
        Array.isArray(data) ? data : data?.items || data?.merchandise || [],
      );
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchItems(false);
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleEditPress = (item) => {
    setIsEditing(true);
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemPrice(item.price.toString());
    setItemStock("120"); // Mock stock as it's not in the data
    setItemDescription(item.description || "");
    setIsModalVisible(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingItemId(null);
    setItemName("");
    setItemPrice("");
    setItemStock("");
    setItemDescription("");
    setSelectedSizes([]);
  };

  const handleSaveItem = async () => {
    if (!itemName || !itemPrice) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      if (activeTab === "Merchandise") {
        const itemData = {
          name: itemName,
          price: parseFloat(itemPrice),
          description: itemDescription,
          sizes: selectedSizes.join(","),
          category: itemSubCategory,
        };

        if (isEditing) {
          // Update logic if endpoint exists
        } else {
          await merchandiseService.uploadMerchandise(itemData);
        }
      }

      Alert.alert(
        "Success",
        `Item ${isEditing ? "updated" : "added"} successfully!`,
      );
      setIsModalVisible(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      Alert.alert("Error", "Failed to save item. Please try again.");
    }
  };

  const MerchandiseCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity>
            <MoreVertical size={16} color={COLORS.gray400} />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardPrice}>${item.price}</Text>
        <Text style={styles.cardStock}>Stock: 120</Text>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => handleEditPress(item)}
          >
            <Edit2 size={14} color={COLORS.brandPurple} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn}>
            <Trash2 size={14} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Store Management</Text>
            <Text style={styles.stadiumSubtitle}>{stadiumLocation}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setIsModalVisible(true);
            }}
          >
            <Plus size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Add Item Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
            resetForm();
          }}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditing ? "Edit" : "Add New"}{" "}
                  {activeTab === "Food"
                    ? "Food/Beverage"
                    : activeTab === "Merchandise"
                      ? "Merchandise"
                      : "Miscellaneous"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false);
                    resetForm();
                  }}
                  style={styles.closeBtn}
                >
                  <X size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                  <Text style={styles.label}>ITEM NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Official Jersey"
                    value={itemName}
                    onChangeText={setItemName}
                  />

                  {activeTab === "Merchandise" && (
                    <View>
                      <Text style={styles.label}>ITEM TYPE</Text>
                      <View style={styles.subCategoryRow}>
                        {["T-Shirt", "Hat", "Scarf", "Other"].map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.subCatBtn,
                              itemSubCategory === type &&
                                styles.activeSubCatBtn,
                            ]}
                            onPress={() => setItemSubCategory(type)}
                          >
                            <Text
                              style={[
                                styles.subCatText,
                                itemSubCategory === type &&
                                  styles.activeSubCatText,
                              ]}
                            >
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  {activeTab === "Miscellaneous" && (
                    <View>
                      <Text style={styles.label}>ITEM TYPE</Text>
                      <View style={styles.subCategoryRow}>
                        {["Poster", "Keychain", "Mug", "Other"].map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.subCatBtn,
                              itemSubCategory === type &&
                                styles.activeSubCatBtn,
                            ]}
                            onPress={() => setItemSubCategory(type)}
                          >
                            <Text
                              style={[
                                styles.subCatText,
                                itemSubCategory === type &&
                                  styles.activeSubCatText,
                              ]}
                            >
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  {activeTab === "Merchandise" &&
                    itemSubCategory === "T-Shirt" && (
                      <View>
                        <Text style={styles.label}>AVAILABLE SIZES</Text>
                        <View style={styles.sizeGrid}>
                          {["S", "M", "L", "XL", "XXL"].map((size) => (
                            <TouchableOpacity
                              key={size}
                              style={[
                                styles.sizeBox,
                                selectedSizes.includes(size) &&
                                  styles.activeSizeBox,
                              ]}
                              onPress={() => toggleSize(size)}
                            >
                              <Text
                                style={[
                                  styles.sizeText,
                                  selectedSizes.includes(size) &&
                                    styles.activeSizeText,
                                ]}
                              >
                                {size}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}

                  <View style={styles.formRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>PRICE ($)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={itemPrice}
                        onChangeText={setItemPrice}
                      />
                    </View>
                    <View style={{ width: 16 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>STOCK</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Units"
                        keyboardType="numeric"
                        value={itemStock}
                        onChangeText={setItemStock}
                      />
                    </View>
                  </View>

                  <Text style={styles.label}>DESCRIPTION</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Short description of the item..."
                    multiline
                    numberOfLines={4}
                    value={itemDescription}
                    onChangeText={setItemDescription}
                  />

                  <TouchableOpacity style={styles.uploadContainer}>
                    <Upload size={24} color={COLORS.brandPurple} />
                    <Text style={styles.uploadText}>Upload Item Image</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSaveItem}
                  >
                    <Text style={styles.submitBtnText}>
                      {isEditing ? "UPDATE ITEM" : "ADD TO INVENTORY"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Merchandise" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Merchandise")}
          >
            <ShoppingBag
              size={16}
              color={
                activeTab === "Merchandise"
                  ? COLORS.brandPurple
                  : COLORS.gray500
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Merchandise" && styles.activeTabText,
              ]}
            >
              Merchandise
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Food" && styles.activeTab]}
            onPress={() => setActiveTab("Food")}
          >
            <Coffee
              size={16}
              color={activeTab === "Food" ? COLORS.brandPurple : COLORS.gray500}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Food" && styles.activeTabText,
              ]}
            >
              Food & Beverage
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Miscellaneous" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Miscellaneous")}
          >
            <MoreVertical
              size={16}
              color={
                activeTab === "Miscellaneous"
                  ? COLORS.brandPurple
                  : COLORS.gray500
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Miscellaneous" && styles.activeTabText,
              ]}
            >
              Miscellaneous
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={20} color={COLORS.gray400} />
            <Text style={styles.searchPlaceholder}>Search items...</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Content List */}
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.brandPurple} />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            renderItem={({ item }) => <MerchandiseCard item={item} />}
            contentContainerStyle={styles.listContent}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  stadiumSubtitle: {
    fontSize: 12,
    color: COLORS.brandPurple,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandPurple,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    borderColor: COLORS.brandPurple,
    backgroundColor: "rgba(123, 44, 191, 0.05)",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray500,
  },
  activeTabText: {
    color: COLORS.brandPurple,
  },
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  searchBar: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  searchPlaceholder: {
    color: COLORS.gray400,
    fontSize: 14,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 16,
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardImage: {
    width: "100%",
    height: 120,
    backgroundColor: COLORS.gray100,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.brandPurple,
    marginBottom: 4,
  },
  cardStock: {
    fontSize: 12,
    color: COLORS.gray500,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
    backgroundColor: "rgba(123, 44, 191, 0.05)",
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.brandPurple,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  form: {
    gap: 16,
  },
  formRow: {
    flexDirection: "row",
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.gray500,
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadContainer: {
    height: 120,
    backgroundColor: "rgba(123, 44, 191, 0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.brandPurple,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 16,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brandPurple,
  },
  submitBtn: {
    backgroundColor: COLORS.brandPurple,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 24,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  subCategoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  subCatBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeSubCatBtn: {
    backgroundColor: "rgba(123, 44, 191, 0.1)",
    borderColor: COLORS.brandPurple,
  },
  subCatText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray500,
  },
  activeSubCatText: {
    color: COLORS.brandPurple,
  },
  sizeGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  sizeBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  activeSizeBox: {
    backgroundColor: COLORS.brandPurple,
    borderColor: COLORS.brandPurple,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.gray500,
  },
  activeSizeText: {
    color: COLORS.white,
  },
});

export default AdminStoreScreen;
