# 后端实现文档

## 项目结构
```
src/
  ├── main/
  │   ├── java/
  │   │   └── com/
  │   │       └── chunshuariyu/
  │   │           ├── controller/    # 控制器
  │   │           ├── service/       # 业务逻辑
  │   │           ├── repository/    # 数据访问
  │   │           ├── model/         # 数据模型
  │   │           ├── dto/           # 数据传输对象
  │   │           ├── config/        # 配置类
  │   │           └── util/          # 工具类
  │   └── resources/
  │       ├── application.yml        # 应用配置
  │       └── db/
  │           └── migration/         # 数据库迁移脚本
  └── test/                          # 测试代码
```

## 核心实现

### 1. 用户认证 (AuthController.java)
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 验证用户身份
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(new ErrorResponse("认证失败"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // 注册新用户
            RegisterResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (UserExistsException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("用户已存在"));
        }
    }
}
```

### 2. 单词学习 (VocabularyController.java)
```java
@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyController {
    
    @Autowired
    private VocabularyService vocabularyService;
    
    @GetMapping("/list")
    public ResponseEntity<?> getList(
        @RequestParam String level,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "20") int pageSize,
        @AuthenticationPrincipal UserDetails user
    ) {
        try {
            // 获取单词列表，包含用户学习状态
            PageResponse<VocabularyDTO> response = vocabularyService.getList(
                user.getId(),
                level, 
                page, 
                pageSize
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("获取单词列表失败"));
        }
    }
    
    @PostMapping("/mark")
    public ResponseEntity<?> markWord(
        @RequestBody MarkWordRequest request,
        @AuthenticationPrincipal UserDetails user
    ) {
        try {
            // 标记单词状态
            vocabularyService.markWord(user.getId(), request);
            return ResponseEntity.ok(new SuccessResponse());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("标记单词状态失败"));
        }
    }
}
```

### 3. 练习系统 (PracticeController.java)
```java
@RestController
@RequestMapping("/api/practice")
public class PracticeController {
    
    @Autowired
    private PracticeService practiceService;
    
    @GetMapping("/list")
    public ResponseEntity<?> getList(
        @RequestParam String level,
        @RequestParam String type,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "20") int pageSize,
        @AuthenticationPrincipal UserDetails user
    ) {
        try {
            // 检查用户权限
            if (!practiceService.hasPermission(user.getId(), level)) {
                return ResponseEntity.status(403).body(new ErrorResponse("无权访问"));
            }
            
            // 获取练习列表
            PageResponse<PracticeDTO> response = practiceService.getList(
                level, 
                type, 
                page, 
                pageSize
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("获取练习列表失败"));
        }
    }
    
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getDetail(
        @PathVariable String id,
        @AuthenticationPrincipal UserDetails user
    ) {
        try {
            // 获取练习详情
            PracticeDetailDTO response = practiceService.getDetail(id, user.getId());
            return ResponseEntity.ok(response);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NoPermissionException e) {
            return ResponseEntity.status(403).body(new ErrorResponse("无权访问"));
        }
    }
    
    @PostMapping("/submit")
    public ResponseEntity<?> submit(
        @RequestBody SubmitAnswersRequest request,
        @AuthenticationPrincipal UserDetails user
    ) {
        try {
            // 提交答案并计算成绩
            PracticeResultDTO response = practiceService.submitAnswers(
                user.getId(), 
                request
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("提交答案失败"));
        }
    }
}
```

### 4. 业务逻辑实现 (VocabularyService.java)
```java
@Service
public class VocabularyService {
    
    @Autowired
    private VocabularyRepository vocabularyRepository;
    
    @Autowired
    private UserVocabularyRepository userVocabularyRepository;
    
    public PageResponse<VocabularyDTO> getList(
        String userId,
        String level, 
        int page, 
        int pageSize
    ) {
        // 获取分页数据
        Page<Vocabulary> vocabularyPage = vocabularyRepository.findByLevel(
            level,
            PageRequest.of(page - 1, pageSize)
        );
        
        // 获取用户学习状态
        Map<String, UserVocabulary> learningStatus = userVocabularyRepository
            .findByUserIdAndVocabularyIds(
                userId,
                vocabularyPage.getContent().stream()
                    .map(Vocabulary::getId)
                    .collect(Collectors.toList())
            )
            .stream()
            .collect(Collectors.toMap(
                UserVocabulary::getVocabularyId,
                Function.identity()
            ));
            
        // 转换为DTO
        List<VocabularyDTO> items = vocabularyPage.getContent().stream()
            .map(vocabulary -> {
                VocabularyDTO dto = convertToDTO(vocabulary);
                UserVocabulary status = learningStatus.get(vocabulary.getId());
                if (status != null) {
                    dto.setStatus(status.getStatus());
                    dto.setNextReviewAt(status.getNextReviewAt());
                }
                return dto;
            })
            .collect(Collectors.toList());
            
        return new PageResponse<>(
            items,
            vocabularyPage.getTotalElements(),
            vocabularyPage.getTotalPages(),
            page
        );
    }
    
    public void markWord(String userId, MarkWordRequest request) {
        // 获取或创建学习记录
        UserVocabulary record = userVocabularyRepository
            .findByUserIdAndVocabularyId(userId, request.getWordId())
            .orElse(new UserVocabulary(userId, request.getWordId()));
            
        // 更新状态
        record.setStatus(request.getStatus());
        
        // 如果是稍后复习，设置下次复习时间
        if (request.getStatus() == WordStatus.REVIEW_LATER) {
            record.setNextReviewAt(calculateNextReviewTime(record.getReviewCount()));
            record.setReviewCount(record.getReviewCount() + 1);
        }
        
        userVocabularyRepository.save(record);
    }
    
    private LocalDateTime calculateNextReviewTime(int reviewCount) {
        // 基于艾宾浩斯记忆曲线计算下次复习时间
        int[] intervals = {5, 30, 12 * 60, 24 * 60, 2 * 24 * 60, 4 * 24 * 60, 7 * 24 * 60};
        int minutesToAdd = intervals[Math.min(reviewCount, intervals.length - 1)];
        return LocalDateTime.now().plusMinutes(minutesToAdd);
    }
}
```

### 5. 反馈处理 (FeedbackController.java)
```java
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody FeedbackRequest request) {
        try {
            // 验证输入
            if (StringUtils.isEmpty(request.getName()) 
                || StringUtils.isEmpty(request.getEmail())
                || StringUtils.isEmpty(request.getMessage())) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("请填写完整信息"));
            }
            
            // 验证邮箱格式
            if (!EmailValidator.getInstance().isValid(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("邮箱格式不正确"));
            }
            
            // 保存反馈
            feedbackService.saveFeedback(request);
            
            return ResponseEntity.ok(new SuccessResponse("感谢您的反馈！我们会尽快处理。"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("提交反馈失败，请稍后重试"));
        }
    }
}
```