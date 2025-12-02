// src/controllers/aiController.js
import { prisma } from "../config/prisma.js";
import { groq } from "../config/groq.js";

// --- Identify greeting ---
function isGreeting(text) {
  const greetings = ["сайн уу", "сайн байна уу", "hello", "hi", "yo", "hey", "сайн байна"];
  return greetings.some((g) => text.toLowerCase().includes(g));
}

function isTaskRelated(text) {
  const keywords = [
    "task",
    "даалгавар",
    "төсл",
    "үүрэг",
    "ажил",
    "дуусгах",
    "due",
    "хийх зүйл",
    "todo",
    "хэдэн",
    "тоолж",
  ];
  return keywords.some((k) => text.toLowerCase().includes(k));
}

function isGoalRelated(text) {
  const keywords = ["зорилго", "goal", "target", "алхам", "явц"];
  return keywords.some((k) => text.toLowerCase().includes(k));
}

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    let finalPrompt = "";
    let contextData = {};

    // Load conversation history (last 10 messages for context)
    const chatHistory = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: 10, // Last 10 exchanges to keep context manageable
    });

    // Always load user data for better context
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    // 1. Greeting
    if (isGreeting(message)) {
      finalPrompt = `Хэрэглэгч "${message}" гэж мэндэллээ. 
Та найрсаг туслах AI. Та монгол хэл дээр хариулна.
Товч, эелдэг байдлаар мэндчил.`;
    }

    // 2. Task related → load all tasks
    else if (isTaskRelated(message)) {
      const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: { dueDate: "asc" },
      });

      contextData.tasks = tasks;
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
      const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;
      const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;

      finalPrompt = `Хэрэглэгч асуусан: "${message}".

Хэрэглэгчийн даалгавруудын дэлгэрэнгүй мэдээлэл:
- Нийт даалгавар: ${totalTasks}
- Хүлээгдэж буй: ${pendingTasks}
- Хийгдэж байгаа: ${inProgressTasks}
- Дууссан: ${completedTasks}

Даалгавруудын жагсаалт:
${JSON.stringify(tasks, null, 2)}

Та монгол хэлээр, даалгавруудын талаар дэлгэрэнгүй мэдээлэл өгөөрэй. Хэрэв хэрэглэгч "хэдэн даалгавар байна", "тоолж өгөөч" гэх мэт асуувал бодит тоогоор хариулаарай. Хэрэв тодорхой даалгаврын талаар асуувал тухайн даалгаврын гарчиг, due date, статус гэх мэт дэлгэрэнгүй мэдээлэл өгөөрэй.`;
    }

    // 3. Goal related
    else if (isGoalRelated(message)) {
      const goals = await prisma.goal.findMany({
        where: { userId },
        include: {
          items: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });

      contextData.goals = goals;
      const totalGoals = goals.length;
      const completedGoals = goals.filter((g) => {
        if (g.items.length > 0) {
          return g.items.every((i) => i.done);
        }
        return g.currentValue >= g.targetValue;
      }).length;

      finalPrompt = `Хэрэглэгч асуусан: "${message}".

Хэрэглэгчийн зорилгуудын мэдээлэл:
- Нийт зорилго: ${totalGoals}
- Хүрсэн зорилго: ${completedGoals}
- Хийгдэж байгаа: ${totalGoals - completedGoals}

Зорилгуудын дэлгэрэнгүй жагсаалт:
${JSON.stringify(goals, null, 2)}

Та монгол хэлээр, зорилгуудын талаар дэлгэрэнгүй мэдээлэл өгөөрэй. Зорилго бүрийн явц, checklist, currentValue/targetValue гэх мэтийг тайлбарлаарай.`;
    }

    // 4. General conversation (still load summary for better responses)
    else {
      const [tasks, goals] = await Promise.all([
        prisma.task.findMany({
          where: { userId },
          orderBy: { dueDate: "asc" },
          take: 20, // limit for context size
        }),
        prisma.goal.findMany({
          where: { userId },
          include: {
            items: { orderBy: { createdAt: "asc" } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

      contextData.tasks = tasks;
      contextData.goals = goals;

      const pendingTasks = tasks.filter((t) => t.status === "PENDING");
      const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
      const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

      const taskSummary = tasks.slice(0, 5).map((t) => ({
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        category: t.category,
      }));

      const goalSummary = goals.slice(0, 3).map((g) => ({
        title: g.title,
        targetValue: g.targetValue,
        currentValue: g.currentValue,
        unit: g.unit,
        itemsCount: g.items.length,
        completedItems: g.items.filter((i) => i.done).length,
      }));

      finalPrompt = `Хэрэглэгчийн асуулт: "${message}"

Context мэдээлэл:
Хэрэглэгч: ${user.name || user.email}

Даалгаврын статистик:
- Нийт: ${tasks.length}
- Хүлээгдэж буй: ${pendingTasks.length}
- Хийгдэж байгаа: ${inProgressTasks.length}
- Дууссан: ${completedTasks.length}

Сүүлийн даалгаврууд:
${JSON.stringify(taskSummary, null, 2)}

Зорилгуудын мэдээлэл:
${JSON.stringify(goalSummary, null, 2)}

---

Та туслах AI. Дээрх context-ийг ашиглан хэрэглэгчийн асуултанд дүн шинжилгээ хийж, зөвлөгөө өгөөрэй.

Хэрэв хэрэглэгч:
- Сургуулийн төлөвлөгөө, хичээлийн талаар асуувал → түүний task, goal-тай холбож санал өг
- Цагаа яаж зөв зарцуулах вэ гэвэл → одоогийн даалгавруудаас нь харж priority-ийг тодорхойл
- Ерөнхий санал хүсвэл → task, goal-ын статистикаас хамааруулж зөвлө
- Танхимд юу хийх вэ гэх мэт → түүний category, priority дээр суурилан төлөвлө

**Чухал:**
- Монгол хэл дээр найрсаг, ойлгомжтой хариулна
- Хэрэглэгчийн өгөгдлийг (task title, goal г.м) санал дотроо дурдаж болно
- Бодит мэдээлэл дээр суурилсан зөвлөгөө өг
- Хэрэв асуулт нь task/goal-тай холбогдохгүй ч гэсэн найрсаг байдлаар хариулж, ерөнхий зөвлөгөө өгөөрэй`;
    }

    // Build conversation messages for Groq API with history
    const conversationMessages = [
      {
        role: "system",
        content: `Та монгол хэл дээр үйлчилдэг туслах AI. Бүх хариултаа ЗӨВХӨН МОНГОЛ ХЭЛЭЭР өгнө. Англи хэл ашиглахгүй. Хэрэглэгч монгол хэлээр асуувал монгол хэлээр хариулна, хэрэглэгч англи хэлээр асуувал ч монгол хэлээр л хариулна. Та найрсаг, ойлгомжтой, тодорхой хариулт өгдөг.
        
Та өмнөх яриаг санаж байна. Хэрэглэгч өмнө яриагаа үргэлжлүүлж асуувал контекст ашиглан хариулаарай.`
      }
    ];

    // Add chat history to conversation
    chatHistory.forEach((chat) => {
      conversationMessages.push(
        { role: "user", content: chat.message },
        { role: "assistant", content: chat.response }
      );
    });

    // Add current message with context
    conversationMessages.push({ role: "user", content: finalPrompt });

    const aiRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 1024, 
    });

    const reply = aiRes.choices[0].message.content;

    const saved = await prisma.chatMessage.create({
      data: { userId, message, response: reply },
    });

    res.json({ success: true, reply, chat: saved, context: contextData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
};

export const getResponse = async (req, res) => {
  const userId = req.user.id;

  try {
    const response = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to get ai response" });
  }
};

export const clearMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    await prisma.chatMessage.deleteMany({
      where: { userId },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to clear ai messages" });
  }
};