import text from "@/constants/text";
import {
  EOrderStatus,
  GetTablesDocument,
  GetUnpaidOrderItemsByTableIdQuery,
  GetUnpaidTablesDocument,
  useCreatePaymentMutation,
} from "@/gql/schema";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

type TransactionProps = {
  orderItems: GetUnpaidOrderItemsByTableIdQuery["orderItems"];
  tableId: number;
  setOrderItems: React.Dispatch<
    React.SetStateAction<GetUnpaidOrderItemsByTableIdQuery["orderItems"]>
  >;
};

const Transaction: React.FC<TransactionProps> = ({
  orderItems,
  setOrderItems,
  tableId,
}) => {
  const [deposit, setDeposit] = useState<number>(0);
  const [depositError, setDepositError] = useState<string>("");
  const toast = useToast();

  const [createPayment] = useCreatePaymentMutation();

  const handleUpdateOrder = async () => {
    if (depositError) return;
    await createPayment({
      variables: {
        createPaymentInput: {
          tableId,
        },
      },
      refetchQueries: [
        { query: GetUnpaidTablesDocument },
        { query: GetTablesDocument },
      ],
      onCompleted: () => {
        toast.show(text.paymentSuccess, {
          type: "success",
          placement: "bottom",
          duration: 3000,
          // offset: 30,
          animationType: "slide-in",
        });
        setDeposit(0);
        setOrderItems([]);
      },
      onError: () => {
        toast.show(text.paymentFailed, {
          type: "error",
          placement: "bottom",
          duration: 3000,
          // offset: 30,
          animationType: "slide-in",
        });
      },
    });
  };

  if (!orderItems.length)
    return <Text className="text-center mt-20 text-base">{text.noData}</Text>;

  const subTotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subTotal * 0.1;
  const total = subTotal + tax;

  return (
    <View className="p-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="gap-4"
      >
        <View className="flex-row justify-between">
          <Text>{text.subTotal}</Text>
          <Text>
            {text.yen}
            {subTotal}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text>{text.tax}</Text>
          <Text>
            {text.yen}
            {tax}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text>{text.total}</Text>
          <Text>
            {text.yen}
            {total}
          </Text>
        </View>
        <View>
          <View className="flex-row justify-between items-center">
            <Text>{text.deposit}</Text>
            <View>
              <TextInput
                className={
                  "h-8 w-24 p-1 text-right border border-solid " +
                  (depositError ? " border-red-500" : " border-black")
                }
                keyboardType="numeric"
                onChangeText={(textInput) => {
                  let deposit = Number(textInput.replace(/[^0-9]/g, ""));
                  if (deposit > 10000000) deposit = 9999999;
                  setDeposit(deposit);
                  if (deposit < total) {
                    setDepositError(text.depositError);
                  } else {
                    setDepositError("");
                  }
                }}
                value={deposit ? deposit.toString() : ""}
              />
            </View>
          </View>
          {depositError && (
            <Text className="text-right mt-2 text-red-500">
              {text.depositError}
            </Text>
          )}
        </View>
        <View className="flex-row justify-between">
          <Text>{text.change}</Text>
          <Text>
            {deposit - total > 0 ? `${text.yen} ${deposit - total}` : ""}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-primary p-4 items-center rounded-lg"
          onPress={handleUpdateOrder}
        >
          <Text className="text-white">{text.payment}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Transaction;
