import{_ as a,o as n,c as p,a4 as i}from"./chunks/framework.Cp_kp8rY.js";const E=JSON.parse('{"title":"CompletableFuture方法使用","description":"","frontmatter":{"title":"CompletableFuture方法使用","date":"2025-06-19 11:56:20","updated":"2025-06-19 11:56:20"},"headers":[],"relativePath":"notes/0/1/1.5/1.5.1/1.5.1.6/1.5.1.6.4/CompletableFuture方法使用.md","filePath":"notes/0/1/1.5/1.5.1/1.5.1.6/1.5.1.6.4/CompletableFuture方法使用.md"}'),l={name:"notes/0/1/1.5/1.5.1/1.5.1.6/1.5.1.6.4/CompletableFuture方法使用.md"};function t(e,s,h,r,k,c){return n(),p("div",null,[...s[0]||(s[0]=[i(`<p>CompletableFuture 是在使用线程池的时候经常使用到的一个类，在实际使用的时候，发现在汇总的时候会有一些不同的操作。</p><p>我们直接来看一个示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//并行调用  </span></span>
<span class="line"><span>public Map&lt;String, String&gt; getBasicTranslationBatch(List&lt;String&gt; text) {  </span></span>
<span class="line"><span>    if (text == null || text.isEmpty()) {  </span></span>
<span class="line"><span>        return Map.of();  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    //对text进行去重处理  </span></span>
<span class="line"><span>    text = text.stream().distinct().collect(Collectors.toList());  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    int batchSize = 15;  </span></span>
<span class="line"><span>    List&lt;CompletableFuture&lt;Map&lt;String, String&gt;&gt;&gt; futures = new ArrayList&lt;&gt;();  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    for (int i = 0; i &lt; text.size(); i += batchSize) {  </span></span>
<span class="line"><span>        int endIndex = Math.min(i + batchSize, text.size());  </span></span>
<span class="line"><span>        List&lt;String&gt; sublist = text.subList(i, endIndex);  </span></span>
<span class="line"><span>        CompletableFuture&lt;Map&lt;String, String&gt;&gt; future = CompletableFuture.supplyAsync(  </span></span>
<span class="line"><span>            () -&gt; getBasicTranslationSafely(sublist),  </span></span>
<span class="line"><span>            findBasicTranslationExecutor  </span></span>
<span class="line"><span>        );  </span></span>
<span class="line"><span>        futures.add(future);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    try {  </span></span>
<span class="line"><span>        CompletableFuture&lt;Void&gt; allOfFuture = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));  </span></span>
<span class="line"><span>        allOfFuture.get();  </span></span>
<span class="line"><span>    } catch (Exception e) {  </span></span>
<span class="line"><span>        log.error(&quot;Error in getBasicTranslationBatch: {}&quot;, e.getMessage(), e);  </span></span>
<span class="line"><span>        throw new GenericException(GenericException.Code.FAIL, &quot;请求外部接口失败&quot;);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    return futures.stream()  </span></span>
<span class="line"><span>        .map(CompletableFuture::join)  </span></span>
<span class="line"><span>        .flatMap(map -&gt; map.entrySet().stream())  </span></span>
<span class="line"><span>        .collect(Collectors.toMap(  </span></span>
<span class="line"><span>            Map.Entry::getKey,  </span></span>
<span class="line"><span>            Map.Entry::getValue,  </span></span>
<span class="line"><span>            // 如果有重复的源文本，保留第一个翻译结果  </span></span>
<span class="line"><span>            (existing, replacement) -&gt; existing  </span></span>
<span class="line"><span>        ));  </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Bean(&quot;findBasicTranslationExecutor&quot;)  </span></span>
<span class="line"><span>public Executor findBasicTranslationExecutor() {  </span></span>
<span class="line"><span>    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();  </span></span>
<span class="line"><span>    // 场景：调用外部接口  </span></span>
<span class="line"><span>    // 设置最大线程数  </span></span>
<span class="line"><span>    executor.setMaxPoolSize(25);  </span></span>
<span class="line"><span>    // 设置核心线程数  </span></span>
<span class="line"><span>    executor.setCorePoolSize(25);  </span></span>
<span class="line"><span>    // 配置队列大小  </span></span>
<span class="line"><span>    executor.setQueueCapacity(500);  </span></span>
<span class="line"><span>    // 拒绝策略-由调用线程（提交任务的线程）处理该任务  </span></span>
<span class="line"><span>    executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());  </span></span>
<span class="line"><span>    // 设置线程活跃时间（秒）  </span></span>
<span class="line"><span>    executor.setKeepAliveSeconds(60);  </span></span>
<span class="line"><span>    // 设置默认线程名称  </span></span>
<span class="line"><span>    executor.setThreadNamePrefix(&quot;findBasicTranslationExecutor&quot;);  </span></span>
<span class="line"><span>    // 等待所有任务结束后再关闭线程池  </span></span>
<span class="line"><span>    executor.setWaitForTasksToCompleteOnShutdown(true);  </span></span>
<span class="line"><span>    // 执行初始化  </span></span>
<span class="line"><span>    executor.initialize();  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    return TtlExecutors.getTtlExecutor(executor);  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>解释一下上面 <code>allOfFuture.get(); </code> 这一行代码的动作</p><p>方式一</p><p>主线程合并结果（平衡方案）</p><ul><li><code>allOfFuture.get()</code>：确保所有异步任务完成。主线程执行结果合并</li></ul><p>这个动作是汇总异步操作返回的所有返回结果，除了上面这种写法之外，还有其他常见的两种</p><p>方式二</p><p>同步合并结果（轻量级）</p><ul><li>合并操作是<strong>同步</strong>的，适合简单快速的聚合操作</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Map&lt;String, String&gt; getBasicTranslationBatch(List&lt;String&gt; text) {</span></span>
<span class="line"><span>    // ... [批处理创建]</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        CompletableFuture&lt;Void&gt; allOfFuture = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));</span></span>
<span class="line"><span>        return allOfFuture.thenApply(v -&gt;  // 同步结果合并</span></span>
<span class="line"><span>            futures.stream()</span></span>
<span class="line"><span>                .map(CompletableFuture::join)</span></span>
<span class="line"><span>                .flatMap(map -&gt; map.entrySet().stream())</span></span>
<span class="line"><span>                .collect(Collectors.toMap(...))</span></span>
<span class="line"><span>        ).get(); // 阻塞获取最终结果</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        // ... [异常处理]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>方式三</p><p>异步合并结果（重量级）</p><ul><li>开启一个新的线程，去做汇总操作</li><li>聚合逻辑复杂耗时 建议使用这种方式</li></ul><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> List</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ProductSkuSpecificationListResponse</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> findSkuSpecifications</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(...) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // ... [批处理创建]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CompletableFuture&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; allOfFuture </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> CompletableFuture.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">allOf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(...);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CompletableFuture&lt;List&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&gt; combinedResults </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> allOfFuture.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">thenCompose</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(v </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        CompletableFuture.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">supplyAsync</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 开启新线程合并结果</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            futures.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stream</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">map</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(CompletableFuture</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">join)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">flatMap</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(list </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> list.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getList</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stream</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">collect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Collectors.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toList</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    List&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; products </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> combinedResults.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 阻塞等待</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> products;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><hr><p>看了一下相关的解释，看 平时使用上面的代码示例方式就好了；</p><p>方式一和方式二 的性能差距并不是很明显，可能一般会 在响应式编程链路中需要延续异步特性时使用</p><p>方式二；不过使用方式二的话，可能在线程池触发拒绝策略的时候会有问题（看具体拒绝策略）。</p>`,20)])])}const u=a(l,[["render",t]]);export{E as __pageData,u as default};
