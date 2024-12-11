import axios from "axios";
import toast from "react-hot-toast";
const API_URL = process.env.REACT_APP_API_URL;
export const APIClient = {
  auth: async (data) => {
    try {
      const resp = await axios.post(`${API_URL}/user/auth`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  tap: async (data) => {
    try {
      const resp = await axios.post(`${API_URL}/user/tap`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  fetchUser: async (data) => {
    try {
      const resp = await axios.post(`${API_URL}/user/getUser`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  fetchUserTaskList: async (data) => {
    try {
      const resp = await axios.post(`${API_URL}/task/user/list`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  fetchRankingRef: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/rank/ref`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  fetchRankingPoint: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/rank/point`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  fetchRankingRefAdmin: async () => {
    try {
      const resp = await axios.post(
        `${API_URL}/admin/rank/ref`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  fetchRankingPointAdmin: async () => {
    try {
      const resp = await axios.post(
        `${API_URL}/admin/rank/point`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  fetchUserRefAdmin: async ({ refUserId, limit, offset, sortField }) => {
    try {
      const res = await axios.post(
        `${API_URL}/admin/user-refs`,
        { refUserId, limit, offset, sortField },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        console.log("fetchUserRefAdmin res", res);
        return res.data;
      } else {
        throw new Error(`Unexpected response status: ${res.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  fetchAnalyticsData: async ({ minutes }) => {
    try {
      const res = await axios.post(
        `${API_URL}/admin/analytics`,
        { minutes },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        console.log("fetchAnalyticsData res", res);
        return res.data;
      } else {
        throw new Error(`Unexpected response status: ${res.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  enableAutoPlay: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/auto/play`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  disableAutoPlay: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/auto/stop`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  verifyGroupTelegram: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/verify/group-telegram`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  verifyChannelTelegram: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/verify/channel-telegram`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  verifyTask: async (userToken, taskCode) => {
    try {
      const resp = await axios.post(
        `${API_URL}/task/verify`,
        {
          userToken,
          code: taskCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  verifyTaskHistory: async (userToken, taskCode) => {
    try {
      const resp = await axios.post(
        `${API_URL}/task/check-task-verify`,
        {
          userToken,
          code: taskCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  verifyTwitter: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}//user/verify/follow-twitter`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  getUserStatus: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/status`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  getTotalUser: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/total-user`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  getUserAdmin: async (userToken, findID) => {
    try {
      const resp = await axios.post(
        `${API_URL}/admin/user`,
        {
          userToken,
          findID,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  updateWaleltAddress: async (userToken, wallet) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/wallet/update`,
        {
          userToken,
          wallet,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  checkin: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/checkin`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  transactions: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/transaction`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  claimTransactions: async (userToken, hash) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/transaction/claim`,
        {
          userToken,
          hash,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  getBoostTnxs: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/boost-tnx`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  claimBoostTnxs: async (userToken, hash) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/claim-boost`,
        {
          userToken,
          hash,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  getCampaigns: async (userToken, hash) => {
    try {
      const resp = await axios.post(
        `${API_URL}/admin/campaign`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  createCampaigns: async (data) => {
    try {
      const resp = await axios.post(
        `${API_URL}/admin/campaign/create`,
        { ...data },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  isChatedWithBot: async (userToken) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/isChatedWithBot`,
        {
          userToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  freeMining: async (userToken, wallet) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/freeMining`,
        {
          userToken,
          wallet,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  claimNode: async (userToken, wallet, mode) => {
    try {
      const resp = await axios.post(
        `${API_URL}/user/claimNode`,
        {
          userToken,
          wallet,
          mode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  getUserFarmSpeed: async (data) => {
    try {
      const resp = await axios.post(`${API_URL}/user/getUserFarmSpeed`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
  getPayloadByCode: async (data) => {
    try {
      const resp = await axios.post(`${API_URL}/user/getPayloadByCode`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.status === 200) {
        return resp.data;
      } else {
        throw new Error(`Unexpected response status: ${resp.status}`);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
};
