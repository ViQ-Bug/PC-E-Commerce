import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Address } from "@/types";
import { useAddresses } from "@/hooks/useAdresses";
import { Ionicons } from "@expo/vector-icons";

interface AddressSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: (address: Address) => void;
  isProcessing: boolean;
}

const AddressSelectionModal = ({
  visible,
  onClose,
  onProceed,
  isProcessing,
}: AddressSelectionModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { addresses, isLoading: addressLoading } = useAddresses();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-slate-300 rounded-t-3xl h-1/2">
          {/* Header */}
          <View className="px-6 py-4 border-b border-surface flex-row items-center justify-between">
            <Text className="text-text-primary text-2xl font-bold">
              Chọn địa chỉ
            </Text>

            <TouchableOpacity
              onPress={onClose}
              className="bg-slate-400 rounded-full p-2"
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 p-6">
            {addressLoading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color="#00D9FF" />
              </View>
            ) : (
              <View className="gap-4">
                {addresses?.map((address: Address) => (
                  <TouchableOpacity
                    key={address._id}
                    className={`bg-surface rounded-3xl p-6 border-2 ${
                      selectedAddress?._id === address._id
                        ? "border-[#5E81AC]"
                        : "border-background-lighter"
                    }`}
                    activeOpacity={0.7}
                    onPress={() => setSelectedAddress(address)}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-3">
                          <Text className="text-[#5E81AC] font-bold text-lg mr-2">
                            {address.label}
                          </Text>
                          {address.isDefault && (
                            <View className="bg-blue-500/20 rounded-full px-3 py-1">
                              <Text className="text-[#5E81AC] text-sm font-semibold">
                                Mặc định
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-text-primary font-semibold text-lg mb-2">
                          {address.fullName}
                        </Text>
                        <Text className="text-text-secondary text-base leading-6 mb-1">
                          {address.streetAddress}
                        </Text>
                        <Text className="text-text-secondary text-base">
                          {address.phoneNumber}
                        </Text>
                      </View>
                      {selectedAddress?._id === address._id && (
                        <View className="bg-[#5E81AC] rounded-full p-2 ml-3">
                          <Ionicons
                            name="checkmark"
                            size={24}
                            color="#121212"
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <View className="p-6 border-t border-surface">
            <TouchableOpacity
              className="bg-[#5E81AC] rounded-2xl py-5"
              activeOpacity={0.9}
              onPress={() => {
                if (selectedAddress) onProceed(selectedAddress);
              }}
              disabled={!selectedAddress || isProcessing}
            >
              <View className="flex-row items-center justify-center">
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#121212" />
                ) : (
                  <>
                    <Text className="text-background font-bold text-lg mr-2">
                      Tiếp tục thanh toán
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#121212" />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddressSelectionModal;
